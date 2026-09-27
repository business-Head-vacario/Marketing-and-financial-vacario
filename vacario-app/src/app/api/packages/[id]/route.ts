import { db } from "@/lib/db";
import { ok, toResponse, requireSessionUser, HttpError } from "@/lib/api";
import { packageSchema } from "@/lib/validators";
import { stringifyList } from "@/lib/utils";

async function ownedPackage(id: string, userId: string, role: string) {
  const pkg = await db.package.findUnique({ where: { id }, include: { agency: { select: { ownerId: true } } } });
  if (!pkg) throw new HttpError("Package not found", 404);
  if (pkg.agency.ownerId !== userId && role !== "ADMIN") throw new HttpError("Not your package", 403);
  return pkg;
}

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireSessionUser();
    const { id } = await ctx.params;
    await ownedPackage(id, user.id, user.role);

    const body = await request.json();

    // Lightweight status flip used by the dashboard's publish/unpublish switch.
    if (body && typeof body === "object" && Object.keys(body).length === 1 && "status" in body) {
      const status = String(body.status);
      if (!["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status)) throw new HttpError("Unknown status", 422);
      const updated = await db.package.update({ where: { id }, data: { status }, select: { id: true, status: true } });
      return ok({ package: updated });
    }

    const input = packageSchema.parse(body);
    const updated = await db.$transaction(async (tx) => {
      await tx.packageDay.deleteMany({ where: { packageId: id } });
      return tx.package.update({
        where: { id },
        data: {
          title: input.title,
          destination: input.destination,
          country: input.country,
          startCity: input.startCity || null,
          summary: input.summary ?? "",
          description: input.description ?? "",
          category: input.category,
          durationDays: input.durationDays,
          durationNights: input.durationNights,
          price: input.price,
          currency: input.currency,
          discountPercent: input.discountPercent,
          minGuests: input.minGuests,
          maxGuests: Math.max(input.minGuests, input.maxGuests),
          inclusions: stringifyList(input.inclusions),
          exclusions: stringifyList(input.exclusions),
          highlights: stringifyList(input.highlights),
          images: stringifyList(input.images),
          coverUrl: input.images[0] ?? null,
          availableFrom: input.availableFrom ? new Date(input.availableFrom) : null,
          availableTo: input.availableTo ? new Date(input.availableTo) : null,
          instantBook: input.instantBook,
          status: input.status,
          dayPlans: {
            create: input.dayPlans.map((day, index) => ({
              dayNumber: index + 1,
              title: day.title,
              description: day.description ?? "",
              meals: day.meals ?? "",
              stay: day.stay ?? "",
            })),
          },
        },
        select: { id: true, slug: true, status: true },
      });
    });

    return ok({ package: updated, next: `/packages/${updated.slug}` });
  } catch (error) {
    return toResponse(error);
  }
}

export async function DELETE(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireSessionUser();
    const { id } = await ctx.params;
    await ownedPackage(id, user.id, user.role);

    const bookings = await db.booking.count({ where: { packageId: id, status: { in: ["PENDING", "CONFIRMED"] } } });
    if (bookings > 0) {
      // Keep the record for travellers who already booked; hide it from the marketplace.
      await db.package.update({ where: { id }, data: { status: "ARCHIVED" } });
      return ok({ archived: id, reason: "This package has live bookings, so it was archived instead of deleted" });
    }

    await db.package.delete({ where: { id } });
    return ok({ deleted: id });
  } catch (error) {
    return toResponse(error);
  }
}
