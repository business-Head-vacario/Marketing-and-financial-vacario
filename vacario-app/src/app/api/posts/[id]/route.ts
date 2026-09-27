import { db } from "@/lib/db";
import { ok, toResponse, requireSessionUser, HttpError } from "@/lib/api";

export async function DELETE(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireSessionUser();
    const { id } = await ctx.params;
    const post = await db.post.findUnique({ where: { id }, select: { authorId: true } });
    if (!post) throw new HttpError("Post not found", 404);
    if (post.authorId !== user.id && user.role !== "ADMIN") throw new HttpError("Not your post", 403);

    await db.post.delete({ where: { id } });
    return ok({ deleted: id });
  } catch (error) {
    return toResponse(error);
  }
}
