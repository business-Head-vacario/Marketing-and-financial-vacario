import { db } from "@/lib/db";
import { ok, toResponse, requireSessionUser, HttpError } from "@/lib/api";
import { reviewSchema } from "@/lib/validators";
import { notify } from "@/lib/notify";

export async function POST(request: Request) {
  try {
    const user = await requireSessionUser();
    const input = reviewSchema.parse(await request.json());

    const agency = await db.agency.findUnique({ where: { id: input.agencyId }, select: { ownerId: true, name: true } });
    if (!agency) throw new HttpError("Agency not found", 404);

    const hasBooking = await db.booking.count({ where: { userId: user.id, agencyId: input.agencyId } });
    if (!hasBooking) throw new HttpError("You can review an agency after booking with them", 403);

    const review = await db.review.create({
      data: {
        agencyId: input.agencyId,
        userId: user.id,
        packageId: input.packageId || null,
        rating: input.rating,
        body: input.body ?? "",
      },
      select: { id: true, rating: true },
    });

    await notify({
      userId: agency.ownerId,
      actorId: user.id,
      type: "BOOKING_STATUS",
      message: `${user.name} left a ${input.rating}★ review`,
      href: "/dashboard",
    });

    return ok({ review }, 201);
  } catch (error) {
    return toResponse(error);
  }
}
