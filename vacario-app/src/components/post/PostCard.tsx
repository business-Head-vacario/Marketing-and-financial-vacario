"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  Bookmark,
  Heart,
  Link2,
  MapPin,
  MessageCircle,
  Route,
  Send,
  Star,
  Ticket,
  Wallet,
} from "lucide-react";
import { Avatar, Badge, VerifiedTick } from "@/components/ui";
import { MediaCarousel } from "@/components/media/MediaView";
import type { FeedPost } from "@/lib/serialize";
import { POST_TYPE_LABEL, type PostType } from "@/lib/constants";
import { cn, money, timeAgo } from "@/lib/utils";

const TYPE_TONE: Record<string, "brand" | "violet" | "lagoon" | "amber"> = {
  PHOTO: "brand",
  REEL: "violet",
  THREESIXTY: "lagoon",
  ITINERARY: "amber",
};

export function PostCard({ post, signedIn }: { post: FeedPost; signedIn: boolean }) {
  const router = useRouter();
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.counts.likes);
  const [saved, setSaved] = useState(post.saved);
  const [comments, setComments] = useState(post.previewComments);
  const [commentCount, setCommentCount] = useState(post.counts.comments);
  const [draft, setDraft] = useState("");
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();

  const guard = () => {
    if (signedIn) return true;
    router.push(`/login?next=/p/${post.id}`);
    return false;
  };

  async function toggleLike() {
    if (!guard()) return;
    const next = !liked;
    setLiked(next);
    setLikes((n) => n + (next ? 1 : -1));
    const res = await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
    if (!res.ok) {
      setLiked(!next);
      setLikes((n) => n + (next ? -1 : 1));
    }
  }

  async function toggleSave() {
    if (!guard()) return;
    const next = !saved;
    setSaved(next);
    const res = await fetch(`/api/posts/${post.id}/save`, { method: "POST" });
    if (!res.ok) setSaved(!next);
  }

  async function submitComment(event: React.FormEvent) {
    event.preventDefault();
    if (!guard() || !draft.trim()) return;
    const body = draft.trim();
    setDraft("");
    const res = await fetch(`/api/posts/${post.id}/comments`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ body }),
    });
    if (res.ok) {
      const created = await res.json();
      setComments((list) => [...list, created.comment].slice(-3));
      setCommentCount((n) => n + 1);
      startTransition(() => router.refresh());
    }
  }

  async function share() {
    const url = `${window.location.origin}/p/${post.id}`;
    try {
      if (navigator.share) await navigator.share({ title: "Vacario", url });
      else await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* user dismissed the share sheet */
    }
  }

  return (
    <article className="vc-card overflow-hidden">
      {/* header */}
      <div className="flex items-center gap-3 px-4 pt-4">
        <Link href={`/u/${post.author.username}`}>
          <Avatar name={post.author.name} src={post.author.avatarUrl} size={44} ring />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Link
              href={`/u/${post.author.username}`}
              className="truncate text-sm font-bold text-ink-900 hover:text-brand-600"
            >
              {post.author.name}
            </Link>
            {post.author.agencyVerified ? <VerifiedTick /> : null}
            {post.author.agencySlug ? (
              <Link
                href={`/agencies/${post.author.agencySlug}`}
                className="hidden truncate text-xs font-semibold text-lagoon-600 hover:underline sm:block"
              >
                {post.author.agencyName}
              </Link>
            ) : null}
          </div>
          <div className="flex items-center gap-1 text-xs text-ink-400">
            {post.locationName ? (
              <>
                <MapPin className="h-3 w-3 text-brand-500" />
                <Link
                  href={`/explore?q=${encodeURIComponent(post.locationName)}`}
                  className="truncate font-semibold text-ink-500 hover:text-brand-600"
                >
                  {post.locationName}
                  {post.country ? `, ${post.country}` : ""}
                </Link>
                <span>·</span>
              </>
            ) : null}
            <span>{timeAgo(post.createdAt)}</span>
          </div>
        </div>
        <Badge tone={TYPE_TONE[post.type] ?? "brand"}>{POST_TYPE_LABEL[post.type as PostType] ?? post.type}</Badge>
      </div>

      {/* media */}
      <div className="px-4 pt-3">
        <MediaCarousel
          items={post.media}
          aspect={post.type === "REEL" ? "aspect-[9/16] max-h-[560px]" : post.type === "THREESIXTY" ? "aspect-[16/10]" : "aspect-[4/5]"}
        />
      </div>

      {/* actions */}
      <div className="flex items-center gap-1 px-3 pt-3">
        <IconAction
          label={liked ? "Unlike" : "Like"}
          onClick={toggleLike}
          className={liked ? "text-rose-500" : "text-ink-500 hover:text-rose-500"}
        >
          <Heart className={cn("h-6 w-6", liked && "fill-current vc-pop")} />
        </IconAction>
        <IconAction label="Comment" href={`/p/${post.id}`}>
          <MessageCircle className="h-6 w-6" />
        </IconAction>
        <IconAction label="Share" onClick={share}>
          {copied ? <Link2 className="h-6 w-6 text-lagoon-600" /> : <Send className="h-6 w-6" />}
        </IconAction>
        <IconAction
          label={saved ? "Remove from saved" : "Save"}
          onClick={toggleSave}
          className={cn("ml-auto", saved ? "text-brand-600" : "text-ink-500 hover:text-brand-600")}
        >
          <Bookmark className={cn("h-6 w-6", saved && "fill-current vc-pop")} />
        </IconAction>
      </div>

      {/* body */}
      <div className="space-y-2 px-4 pb-4 pt-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <span className="font-bold text-ink-900">{likes.toLocaleString("en-IN")} likes</span>
          {post.rating ? (
            <span className="flex items-center gap-0.5 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={cn("h-3.5 w-3.5", i < post.rating! ? "fill-current" : "text-ink-200")} />
              ))}
            </span>
          ) : null}
          {post.budget ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
              <Wallet className="h-3.5 w-3.5" /> {money(post.budget, post.currency)} trip
            </span>
          ) : null}
          {post.tripMonth ? (
            <span className="rounded-full bg-sky-50 px-2 py-0.5 text-xs font-bold text-sky-700">{post.tripMonth}</span>
          ) : null}
        </div>

        {post.caption ? (
          <p className="whitespace-pre-line text-sm leading-relaxed text-ink-700">
            <Link href={`/u/${post.author.username}`} className="mr-1.5 font-bold text-ink-900">
              {post.author.username}
            </Link>
            {post.caption}
          </p>
        ) : null}

        {post.tags.length ? (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/explore?tag=${encodeURIComponent(tag)}`}
                className="text-xs font-bold text-brand-600 hover:underline"
              >
                #{tag}
              </Link>
            ))}
          </div>
        ) : null}

        {post.itinerary ? (
          <Link
            href={`/itineraries/${post.itinerary.id}`}
            className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-3 transition hover:border-amber-300 hover:bg-amber-50"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-amber-400 text-white">
              <Route className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold text-ink-900">{post.itinerary.title}</span>
              <span className="block truncate text-xs text-ink-500">
                {post.itinerary.days}-day plan · {post.itinerary.destination}
                {post.itinerary.budget ? ` · ${money(post.itinerary.budget, post.itinerary.currency)}` : ""}
              </span>
            </span>
            <span className="text-xs font-bold text-amber-700">View plan →</span>
          </Link>
        ) : null}

        {post.package ? (
          <div className="flex items-center gap-3 rounded-2xl border border-lagoon-200 bg-lagoon-50/70 p-3">
            {post.package.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.package.coverUrl} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
            ) : (
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-lagoon-500 text-white">
                <Ticket className="h-5 w-5" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-bold text-ink-900">{post.package.title}</div>
              <div className="truncate text-xs text-ink-500">
                {post.package.durationDays}D/{post.package.durationNights}N · by {post.package.agencyName}
              </div>
              <div className="text-sm font-extrabold text-lagoon-700">
                {money(
                  post.package.price * (1 - post.package.discountPercent / 100),
                  post.package.currency,
                )}
                <span className="ml-1 text-[11px] font-semibold text-ink-400">per person</span>
              </div>
            </div>
            <Link
              href={`/packages/${post.package.slug}`}
              className="rounded-full vc-lagoon px-3.5 py-2 text-xs font-bold text-white shadow"
            >
              Book
            </Link>
          </div>
        ) : null}

        {commentCount > comments.length ? (
          <Link href={`/p/${post.id}`} className="block text-xs font-semibold text-ink-400 hover:text-ink-600">
            View all {commentCount} comments
          </Link>
        ) : null}

        {comments.map((comment) => (
          <p key={comment.id} className="text-sm text-ink-700">
            <Link href={`/u/${comment.user.username}`} className="mr-1.5 font-bold text-ink-900">
              {comment.user.username}
            </Link>
            {comment.body}
          </p>
        ))}

        <form onSubmit={submitComment} className="flex items-center gap-2 pt-1">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add a comment…"
            aria-label="Add a comment"
            className="flex-1 rounded-full border border-ink-200 bg-ink-50/60 px-4 py-2 text-sm outline-none transition placeholder:text-ink-300 focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100"
          />
          <button
            type="submit"
            disabled={!draft.trim() || pending}
            className="rounded-full vc-sunset px-4 py-2 text-xs font-bold text-white disabled:opacity-40"
          >
            Post
          </button>
        </form>
      </div>
    </article>
  );
}

function IconAction({
  children,
  label,
  onClick,
  href,
  className,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
  className?: string;
}) {
  const classes = cn("rounded-full p-2 text-ink-500 transition hover:bg-ink-100", className);
  if (href) {
    return (
      <Link href={href} aria-label={label} title={label} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
