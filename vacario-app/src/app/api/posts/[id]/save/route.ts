import { db } from "@/lib/db";
import { ok, toResponse, requireSessionUser, HttpError } from "@/lib/api";

export async function POST(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireSessionUser();
    const { id } = await ctx.params;

    const exists = await db.post.findUnique({ where: { id }, select: { id: true } });
    if (!exists) throw new HttpError("Post not found", 404);

    const existing = await db.save.findUnique({ where: { postId_userId: { postId: id, userId: user.id } } });
    if (existing) await db.save.delete({ where: { id: existing.id } });
    else await db.save.create({ data: { postId: id, userId: user.id } });

    return ok({ saved: !existing });
  } catch (error) {
    return toResponse(error);
  }
}
