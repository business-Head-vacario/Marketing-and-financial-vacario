import { db } from "@/lib/db";
import { ok, toResponse, requireSessionUser, HttpError } from "@/lib/api";
import { notify } from "@/lib/notify";

export async function POST(request: Request) {
  try {
    const user = await requireSessionUser();
    const { username } = (await request.json()) as { username?: string };
    if (!username) throw new HttpError("Who do you want to follow?", 400);

    const target = await db.user.findUnique({ where: { username }, select: { id: true } });
    if (!target) throw new HttpError("Account not found", 404);
    if (target.id === user.id) throw new HttpError("You can't follow yourself", 400);

    const existing = await db.follow.findUnique({
      where: { followerId_followingId: { followerId: user.id, followingId: target.id } },
    });
    if (existing) {
      await db.follow.delete({ where: { id: existing.id } });
    } else {
      await db.follow.create({ data: { followerId: user.id, followingId: target.id } });
      await notify({
        userId: target.id,
        actorId: user.id,
        type: "FOLLOW",
        message: `${user.name} started following you`,
        href: `/u/${user.username}`,
      });
    }

    const followers = await db.follow.count({ where: { followingId: target.id } });
    return ok({ following: !existing, followers });
  } catch (error) {
    return toResponse(error);
  }
}
