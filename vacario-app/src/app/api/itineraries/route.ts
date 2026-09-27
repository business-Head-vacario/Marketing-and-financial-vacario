import { db } from "@/lib/db";
import { ok, toResponse, requireSessionUser } from "@/lib/api";
import { itinerarySchema } from "@/lib/validators";
import { stringifyList } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const user = await requireSessionUser();
    const input = itinerarySchema.parse(await request.json());

    const itinerary = await db.itinerary.create({
      data: {
        authorId: user.id,
        title: input.title,
        destination: input.destination,
        country: input.country || null,
        summary: input.summary ?? "",
        days: input.dayPlans.length,
        budget: input.budget ?? null,
        currency: input.currency,
        coverUrl: input.coverUrl || null,
        style: input.style || null,
        bestSeason: input.bestSeason || null,
        tags: stringifyList(input.tags),
        isPublic: input.isPublic,
        dayPlans: {
          create: input.dayPlans.map((day, index) => ({
            dayNumber: index + 1,
            title: day.title ?? "",
            notes: day.notes ?? "",
            stops: {
              create: day.stops.map((stop, stopIndex) => ({
                order: stopIndex,
                time: stop.time || null,
                title: stop.title,
                place: stop.place || null,
                note: stop.note || null,
                cost: stop.cost ?? null,
                category: stop.category,
              })),
            },
          })),
        },
      },
      select: { id: true, title: true, coverUrl: true, destination: true, country: true },
    });

    if (input.shareToFeed) {
      await db.post.create({
        data: {
          authorId: user.id,
          type: "ITINERARY",
          caption: input.summary || `${input.dayPlans.length}-day plan for ${input.destination}`,
          locationName: input.destination,
          country: input.country || null,
          tags: stringifyList(input.tags),
          budget: input.budget ?? null,
          currency: input.currency,
          itineraryId: itinerary.id,
          media: {
            create: [
              {
                url: input.coverUrl || "/seed/itinerary-cover.svg",
                kind: "IMAGE",
                alt: `${input.destination} itinerary`,
                order: 0,
              },
            ],
          },
        },
      });
    }

    return ok({ itinerary, next: `/itineraries/${itinerary.id}` }, 201);
  } catch (error) {
    return toResponse(error);
  }
}
