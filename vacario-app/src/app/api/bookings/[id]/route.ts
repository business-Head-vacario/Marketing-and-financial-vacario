import { db } from "@/lib/db";
import { ok, toResponse, requireSessionUser, HttpError } from "@/lib/api";
import { bookingStatusSchema } from "@/lib/validators";
import { notify } from "@/lib/notify";

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireSessionUser();
    const { id } = await ctx.params;
    const { status } = bookingStatusSchema.parse(await request.json());

    const booking = await db.booking.findUnique({
      where: { id },
      include: {
        agency: { select: { ownerId: true, name: true } },
        package: { select: { title: true } },
        payment: { select: { id: true } },
      },
    });
    if (!booking) throw new HttpError("Booking not found", 404);

    const isAgent = booking.agency.ownerId === user.id;
    const isTraveller = booking.userId === user.id;
    const isAdmin = user.role === "ADMIN";
    if (!isAgent && !isTraveller && !isAdmin) throw new HttpError("Not your booking", 403);

    // A traveller may only cancel; confirming and completing belong to the agency.
    if (isTraveller && !isAgent && !isAdmin && status !== "CANCELLED") {
      throw new HttpError("Only the agency can change this booking's status", 403);
    }
    if (booking.status === "COMPLETED") throw new HttpError("This trip is already completed", 409);

    const updated = await db.booking.update({ where: { id }, data: { status }, select: { id: true, status: true } });

    if (status === "CANCELLED" && booking.payment) {
      await db.payment.update({ where: { bookingId: id }, data: { status: "REFUNDED" } });
    }

    await notify({
      userId: isAgent ? booking.userId : booking.agency.ownerId,
      actorId: user.id,
      type: "BOOKING_STATUS",
      message: `Booking ${booking.reference} (${booking.package.title}) is now ${status.toLowerCase()}`,
      href: isAgent ? `/bookings/${id}` : "/dashboard/bookings",
    });

    return ok({ booking: updated });
  } catch (error) {
    return toResponse(error);
  }
}
