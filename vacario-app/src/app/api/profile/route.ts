import { db } from "@/lib/db";
import { ok, toResponse, requireSessionUser } from "@/lib/api";
import { travellerProfileSchema } from "@/lib/validators";
import { stringifyList } from "@/lib/utils";

export async function PATCH(request: Request) {
  try {
    const user = await requireSessionUser();
    const input = travellerProfileSchema.parse(await request.json());

    const updated = await db.user.update({
      where: { id: user.id },
      data: {
        ...(input.name ? { name: input.name } : {}),
        bio: input.bio ?? user.bio,
        homeCity: input.homeCity ?? user.homeCity,
        country: input.country ?? user.country,
        website: input.website || null,
        avatarUrl: input.avatarUrl || user.avatarUrl,
        coverUrl: input.coverUrl || user.coverUrl,
        interests: stringifyList(input.interests),
        travelStyle: input.travelStyle || user.travelStyle,
        onboarded: true,
      },
      select: { id: true, username: true, onboarded: true },
    });

    return ok({ user: updated, next: `/u/${updated.username}` });
  } catch (error) {
    return toResponse(error);
  }
}
