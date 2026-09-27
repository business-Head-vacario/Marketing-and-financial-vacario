import { db } from "@/lib/db";
import { ok, toResponse, requireSessionUser, HttpError } from "@/lib/api";
import { notify } from "@/lib/notify";

export async function POST(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireSessionUser();
    const { id } = await ctx.params;

    const post = await db.post.findUnique({ where: { id }, select: { authorId: true } });
    if (!post) throw new HttpError("Post not found", 404);

    const existing = await db.like.findUnique({ where: { postId_userId: { postId: id, userId: user.id } } });
    if (existing) {
      await db.like.delete({ where: { id: existing.id } });
    } else {
      await db.like.create({ data: { postId: id, userId: user.id } });
      await notify({
        userId: post.authorId,
        actorId: user.id,
        type: "LIKE",
        message: `${user.name} liked your post`,
        href: `/p/${id}`,
      });
    }

    const likes = await db.like.count({ where: { postId: id } });
    return ok({ liked: !existing, likes });
  } catch (error) {
    return toResponse(error);
  }
}
