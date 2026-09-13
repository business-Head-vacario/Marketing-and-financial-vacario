import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { postInclude, toFeedPost } from "@/lib/serialize";
import { PostCard } from "@/components/post/PostCard";
import { PostTile } from "@/components/cards";
import { Avatar } from "@/components/ui";
import { timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await db.post.findUnique({
    where: { id },
    select: { caption: true, locationName: true, author: { select: { name: true } } },
  });
  if (!post) return { title: "Post not found" };
  return {
    title: `${post.author.name}${post.locationName ? ` in ${post.locationName}` : ""}`,
    description: post.caption.slice(0, 150),
  };
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const viewer = await getCurrentUser();

  const post = await db.post.findUnique({ where: { id }, include: postInclude(viewer?.id) });
  if (!post) notFound();

  const [comments, more] = await Promise.all([
    db.comment.findMany({
      where: { postId: id },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        body: true,
        createdAt: true,
        user: { select: { name: true, username: true, avatarUrl: true } },
      },
    }),
    db.post.findMany({
      where: { authorId: post.authorId, id: { not: id } },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        type: true,
        caption: true,
        media: { orderBy: { order: "asc" }, take: 1, select: { url: true, kind: true, posterUrl: true } },
        _count: { select: { likes: true, comments: true } },
      },
    }),
  ]);

  const feedPost = { ...toFeedPost(post), previewComments: [] };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5 px-3 sm:px-4">
      <Link href="/" className="inline-flex items-center gap-1 text-sm font-bold text-ink-500 hover:text-brand-600">
        <ChevronLeft className="h-4 w-4" /> Back to feed
      </Link>

      <PostCard post={feedPost} signedIn={Boolean(viewer)} />

      <section className="vc-card p-5">
        <h2 className="mb-4 font-display text-lg font-black">
          {comments.length} {comments.length === 1 ? "comment" : "comments"}
        </h2>
        {comments.length ? (
          <ul className="space-y-4">
            {comments.map((comment) => (
              <li key={comment.id} className="flex gap-3">
                <Avatar name={comment.user.name} src={comment.user.avatarUrl} size={36} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <Link href={`/u/${comment.user.username}`} className="text-sm font-bold text-ink-900 hover:text-brand-600">
                      {comment.user.name}
                    </Link>
                    <span className="text-[11px] text-ink-400">{timeAgo(comment.createdAt)}</span>
                  </div>
                  <p className="text-sm text-ink-700">{comment.body}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-ink-400">No comments yet — say something nice.</p>
        )}
      </section>

      {more.length ? (
        <section>
          <h2 className="mb-3 font-display text-lg font-black">
            More from <Link href={`/u/${post.author.username}`} className="text-brand-600 hover:underline">@{post.author.username}</Link>
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {more.map((item) => (
              <PostTile key={item.id} post={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
