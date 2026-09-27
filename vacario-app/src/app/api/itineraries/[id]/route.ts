import { db } from "@/lib/db";
import { ok, toResponse, requireSessionUser, HttpError } from "@/lib/api";

/** Fork: copy someone else's public plan into your own account so you can edit it. */
export async function POST(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireSessionUser();
    const { id } = await ctx.params;

    const source = await db.itinerary.findUnique({
      where: { id },
      include: { dayPlans: { include: { stops: { orderBy: { order: "asc" } } }, orderBy: { dayNumber: "asc" } } },
    });
    if (!source) throw new HttpError("Itinerary not found", 404);
    if (!source.isPublic && source.authorId !== user.id) throw new HttpError("This plan is private", 403);

    const copy = await db.itinerary.create({
      data: {
        authorId: user.id,
        title: `${source.title} (my copy)`,
        destination: source.destination,
        country: source.country,
        summary: source.summary,
        days: source.days,
        budget: source.budget,
        currency: source.currency,
        coverUrl: source.coverUrl,
        style: source.style,
        bestSeason: source.bestSeason,
        tags: source.tags,
        isPublic: false,
        forkedFromId: source.id,
        dayPlans: {
          create: source.dayPlans.map((day) => ({
            dayNumber: day.dayNumber,
            title: day.title,
            notes: day.notes,
            stops: {
              create: day.stops.map((stop) => ({
                order: stop.order,
                time: stop.time,
                title: stop.title,
                place: stop.place,
                note: stop.note,
                cost: stop.cost,
                category: stop.category,
              })),
            },
          })),
        },
      },
      select: { id: true },
    });

    return ok({ itinerary: copy, next: `/itineraries/${copy.id}` }, 201);
  } catch (error) {
    return toResponse(error);
  }
}

export async function DELETE(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireSessionUser();
    const { id } = await ctx.params;
    const itinerary = await db.itinerary.findUnique({ where: { id }, select: { authorId: true } });
    if (!itinerary) throw new HttpError("Itinerary not found", 404);
    if (itinerary.authorId !== user.id && user.role !== "ADMIN") throw new HttpError("Not your itinerary", 403);

    await db.itinerary.delete({ where: { id } });
    return ok({ deleted: id });
  } catch (error) {
    return toResponse(error);
  }
}
