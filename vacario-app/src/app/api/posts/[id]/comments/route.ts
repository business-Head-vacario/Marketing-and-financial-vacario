import { db } from "@/lib/db";
import { ok, toResponse, requireSessionUser, HttpError } from "@/lib/api";
import { commentSchema } from "@/lib/validators";
import { notify } from "@/lib/notify";

export async function POST(request: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireSessionUser();
    const { id } = await ctx.params;
    const { body } = commentSchema.parse(await request.json());

    const post = await db.post.findUnique({ where: { id }, select: { authorId: true } });
    if (!post) throw new HttpError("Post not found", 404);

    const comment = await db.comment.create({
      data: { postId: id, userId: user.id, body },
      select: {
        id: true,
        body: true,
        createdAt: true,
        user: { select: { name: true, username: true, avatarUrl: true } },
      },
    });

    await notify({
      userId: post.authorId,
      actorId: user.id,
      type: "COMMENT",
      message: `${user.name} commented: "${body.slice(0, 60)}"`,
      href: `/p/${id}`,
    });

    return ok({ comment: { ...comment, createdAt: comment.createdAt.toISOString() } }, 201);
  } catch (error) {
    return toResponse(error);
  }
}
