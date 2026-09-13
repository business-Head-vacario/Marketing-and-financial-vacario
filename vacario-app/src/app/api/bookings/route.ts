import { db } from "@/lib/db";
import { ok, toResponse, requireSessionUser, HttpError } from "@/lib/api";
import { bookingSchema } from "@/lib/validators";
import { bookingReference, money } from "@/lib/utils";
import { quoteFor } from "@/lib/pricing";
import { notify } from "@/lib/notify";

export async function POST(request: Request) {
  try {
    const user = await requireSessionUser();
    const input = bookingSchema.parse(await request.json());

    const pkg = await db.package.findUnique({
      where: { id: input.packageId },
      include: { agency: { select: { id: true, name: true, ownerId: true, slug: true } } },
    });
    if (!pkg) throw new HttpError("Package not found", 404);
    if (pkg.status !== "PUBLISHED") throw new HttpError("This package is not open for booking", 409);
    if (input.guests < pkg.minGuests) throw new HttpError(`Minimum ${pkg.minGuests} guest(s) for this package`, 422);
    if (input.guests > pkg.maxGuests) throw new HttpError(`Maximum ${pkg.maxGuests} guests for this package`, 422);

    const travelDate = new Date(input.travelDate);
    if (Number.isNaN(travelDate.getTime())) throw new HttpError("Invalid travel date", 422);
    if (travelDate < new Date(new Date().toDateString())) throw new HttpError("Pick a travel date in the future", 422);
    if (pkg.availableFrom && travelDate < pkg.availableFrom) {
      throw new HttpError(`This package starts running from ${pkg.availableFrom.toDateString()}`, 422);
    }
    if (pkg.availableTo && travelDate > pkg.availableTo) {
      throw new HttpError(`This package runs only until ${pkg.availableTo.toDateString()}`, 422);
    }

    const quote = quoteFor(pkg, input.guests);
    const paid = input.paymentMethod !== "PAY_AT_AGENCY";

    const booking = await db.booking.create({
      data: {
        reference: bookingReference(),
        packageId: pkg.id,
        agencyId: pkg.agency.id,
        userId: user.id,
        travelDate,
        guests: quote.guests,
        travellerName: input.travellerName,
        travellerEmail: input.travellerEmail,
        travellerPhone: input.travellerPhone,
        notes: input.notes ?? "",
        subtotal: quote.subtotal,
        discount: quote.discount,
        taxes: quote.taxes,
        total: quote.total,
        currency: pkg.currency,
        // Instant-book packages confirm on payment; the rest wait for the agency.
        status: pkg.instantBook && paid ? "CONFIRMED" : "PENDING",
        payment: {
          create: {
            amount: quote.total,
            currency: pkg.currency,
            method: input.paymentMethod,
            status: paid ? "PAID" : "UNPAID",
            // Simulated gateway reference. Swap for the provider's payment id when
            // a real gateway is wired in — nothing else in the flow changes.
            reference: `SIM-${Date.now().toString(36).toUpperCase()}`,
          },
        },
      },
      include: { package: { select: { title: true, slug: true } } },
    });

    await notify({
      userId: pkg.agency.ownerId,
      actorId: user.id,
      type: "BOOKING",
      message: `New booking ${booking.reference} · ${pkg.title} · ${quote.guests} guest(s) · ${money(quote.total, pkg.currency)}`,
      href: "/dashboard/bookings",
    });

    return ok({ booking: { id: booking.id, reference: booking.reference, status: booking.status }, next: `/bookings/${booking.id}` }, 201);
  } catch (error) {
    return toResponse(error);
  }
}
