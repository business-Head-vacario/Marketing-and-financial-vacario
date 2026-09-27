import { db } from "@/lib/db";
import { ok, toResponse, requireSessionUser, HttpError } from "@/lib/api";
import { packageSchema } from "@/lib/validators";
import { slugify, stringifyList } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const user = await requireSessionUser();
    if (!user.agency) throw new HttpError("Create your agency profile first", 403);

    const input = packageSchema.parse(await request.json());

    let slug = `${slugify(input.title)}-${slugify(user.agency.name).slice(0, 12)}`;
    for (let attempt = 1; await db.package.findUnique({ where: { slug }, select: { id: true } }); attempt++) {
      slug = `${slugify(input.title)}-${attempt}`;
    }

    const created = await db.package.create({
      data: {
        agencyId: user.agency.id,
        title: input.title,
        slug,
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
      select: { id: true, slug: true, title: true, status: true },
    });

    return ok({ package: created, next: `/packages/${created.slug}` }, 201);
  } catch (error) {
    return toResponse(error);
  }
}
