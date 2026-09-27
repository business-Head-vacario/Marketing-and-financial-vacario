"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Bookmark, Heart, MapPin, MessageCircle, Music, Send, Ticket, Volume2, VolumeX } from "lucide-react";
import { Avatar, VerifiedTick } from "@/components/ui";
import type { FeedPost } from "@/lib/serialize";
import { cn, money, timeAgo } from "@/lib/utils";

export function ReelViewer({ reels, signedIn }: { reels: FeedPost[]; signedIn: boolean }) {
  const [muted, setMuted] = useState(true);

  return (
    <div className="vc-snap-y vc-scroll-hide h-[calc(100dvh-8rem)] snap-y overflow-y-auto lg:h-[calc(100dvh-4rem)]">
      {reels.map((reel) => (
        <ReelItem key={reel.id} reel={reel} signedIn={signedIn} muted={muted} onToggleMute={() => setMuted((m) => !m)} />
      ))}
      {!reels.length ? (
        <div className="grid h-full place-items-center text-center text-white/80">
          <div>
            <p className="font-display text-2xl font-black">No reels yet</p>
            <p className="mt-1 text-sm">Be the first — upload a vertical clip from your last trip.</p>
            <Link href="/create?type=REEL" className="mt-4 inline-block rounded-full vc-sunset px-5 py-2.5 text-sm font-bold text-white">
              Post a reel
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ReelItem({
  reel,
  signedIn,
  muted,
  onToggleMute,
}: {
  reel: FeedPost;
  signedIn: boolean;
  muted: boolean;
  onToggleMute: () => void;
}) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [liked, setLiked] = useState(reel.liked);
  const [likes, setLikes] = useState(reel.counts.likes);
  const [saved, setSaved] = useState(reel.saved);
  const media = reel.media[0];

  // Play only the reel currently filling the viewport.
  useEffect(() => {
    const node = ref.current;
    const video = videoRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!video) return;
        if (entry.isIntersecting && entry.intersectionRatio > 0.6) void video.play().catch(() => undefined);
        else video.pause();
      },
      { threshold: [0, 0.6, 1] },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  async function toggleLike() {
    if (!signedIn) return router.push("/login?next=/reels");
    const next = !liked;
    setLiked(next);
    setLikes((n) => n + (next ? 1 : -1));
    const res = await fetch(`/api/posts/${reel.id}/like`, { method: "POST" });
    if (!res.ok) {
      setLiked(!next);
      setLikes((n) => n + (next ? -1 : 1));
    }
  }

  async function toggleSave() {
    if (!signedIn) return router.push("/login?next=/reels");
    const next = !saved;
    setSaved(next);
    const res = await fetch(`/api/posts/${reel.id}/save`, { method: "POST" });
    if (!res.ok) setSaved(!next);
  }

  return (
    <section ref={ref} className="vc-snap-item relative grid h-full w-full place-items-center bg-ink-900 py-2">
      <div className="relative h-full w-full max-w-[440px] overflow-hidden rounded-3xl bg-black">
        {media?.kind === "VIDEO" ? (
          <video
            ref={videoRef}
            src={media.url}
            poster={media.posterUrl ?? undefined}
            loop
            muted={muted}
            playsInline
            className="h-full w-full object-cover"
          />
        ) : media ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={media.url} alt={reel.caption.slice(0, 60)} className="vc-kenburns h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full vc-sunset" />
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

        {/* right action rail */}
        <div className="absolute bottom-24 right-3 flex flex-col items-center gap-5 text-white">
          <button onClick={toggleLike} className="flex flex-col items-center gap-1" aria-label="Like">
            <Heart className={cn("h-8 w-8 drop-shadow", liked && "fill-rose-500 text-rose-500 vc-pop")} />
            <span className="text-[11px] font-bold">{likes}</span>
          </button>
          <Link href={`/p/${reel.id}`} className="flex flex-col items-center gap-1" aria-label="Comments">
            <MessageCircle className="h-8 w-8 drop-shadow" />
            <span className="text-[11px] font-bold">{reel.counts.comments}</span>
          </Link>
          <button onClick={toggleSave} className="flex flex-col items-center gap-1" aria-label="Save">
            <Bookmark className={cn("h-8 w-8 drop-shadow", saved && "fill-white vc-pop")} />
            <span className="text-[11px] font-bold">Save</span>
          </button>
          <button
            onClick={() => {
              const url = `${window.location.origin}/p/${reel.id}`;
              if (navigator.share) void navigator.share({ url }).catch(() => undefined);
              else void navigator.clipboard.writeText(url);
            }}
            className="flex flex-col items-center gap-1"
            aria-label="Share"
          >
            <Send className="h-8 w-8 drop-shadow" />
            <span className="text-[11px] font-bold">Share</span>
          </button>
          {media?.kind === "VIDEO" ? (
            <button onClick={onToggleMute} className="grid h-10 w-10 place-items-center rounded-full bg-white/15 backdrop-blur" aria-label="Toggle sound">
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          ) : null}
        </div>

        {/* bottom meta */}
        <div className="absolute inset-x-0 bottom-0 space-y-2 p-4 pr-20 text-white">
          <div className="flex items-center gap-2">
            <Avatar name={reel.author.name} src={reel.author.avatarUrl} size={38} ring />
            <Link href={`/u/${reel.author.username}`} className="flex items-center gap-1 text-sm font-black">
              @{reel.author.username}
              {reel.author.agencyVerified ? <VerifiedTick className="h-3.5 w-3.5" /> : null}
            </Link>
            <span className="text-xs text-white/60">· {timeAgo(reel.createdAt)}</span>
          </div>
          {reel.caption ? <p className="line-clamp-3 text-sm text-white/95">{reel.caption}</p> : null}
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
            {reel.locationName ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 backdrop-blur">
                <MapPin className="h-3 w-3" /> {reel.locationName}
              </span>
            ) : null}
            {reel.budget ? (
              <span className="rounded-full bg-emerald-500/90 px-2.5 py-1">{money(reel.budget, reel.currency)} trip</span>
            ) : null}
            {reel.tags.slice(0, 3).map((tag) => (
              <Link key={tag} href={`/explore?tag=${encodeURIComponent(tag)}`} className="rounded-full bg-white/15 px-2.5 py-1 backdrop-blur">
                #{tag}
              </Link>
            ))}
            <span className="inline-flex items-center gap-1 text-white/70">
              <Music className="h-3 w-3" /> original audio
            </span>
          </div>

          {reel.package ? (
            <Link
              href={`/packages/${reel.package.slug}`}
              className="mt-1 flex items-center gap-2 rounded-2xl bg-white/95 p-2.5 text-ink-900 shadow-lg"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl vc-lagoon text-white">
                <Ticket className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-black">{reel.package.title}</span>
                <span className="block text-[11px] text-ink-500">
                  {money(reel.package.price * (1 - reel.package.discountPercent / 100), reel.package.currency)} · {reel.package.agencyName}
                </span>
              </span>
              <span className="rounded-full vc-sunset px-3 py-1.5 text-[11px] font-black text-white">Book</span>
            </Link>
          ) : reel.itinerary ? (
            <Link
              href={`/itineraries/${reel.itinerary.id}`}
              className="mt-1 flex items-center gap-2 rounded-2xl bg-white/95 p-2.5 text-ink-900 shadow-lg"
            >
              <span className="min-w-0 flex-1 truncate text-xs font-black">📍 {reel.itinerary.title}</span>
              <span className="rounded-full bg-amber-400 px-3 py-1.5 text-[11px] font-black text-white">View plan</span>
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
