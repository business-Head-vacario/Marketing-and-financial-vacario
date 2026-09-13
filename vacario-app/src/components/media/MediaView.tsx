"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play, Volume2, VolumeX } from "lucide-react";
import { Panorama } from "./Panorama";
import { cn } from "@/lib/utils";

export type MediaItem = {
  id?: string;
  url: string;
  kind: string;
  posterUrl?: string | null;
  alt?: string | null;
};

export function SingleMedia({
  item,
  className,
  rounded = true,
  cover = true,
}: {
  item: MediaItem;
  className?: string;
  rounded?: boolean;
  cover?: boolean;
}) {
  if (item.kind === "PANORAMA") {
    return <Panorama src={item.url} className={cn(className, rounded && "rounded-2xl")} />;
  }
  if (item.kind === "VIDEO") {
    return <InlineVideo item={item} className={cn(className, rounded && "rounded-2xl")} />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={item.url}
      alt={item.alt ?? "Travel photo"}
      loading="lazy"
      className={cn("h-full w-full bg-ink-100", cover ? "object-cover" : "object-contain", rounded && "rounded-2xl", className)}
    />
  );
}

export function InlineVideo({ item, className }: { item: MediaItem; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);

  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-ink-900", className)}>
      <video
        ref={ref}
        src={item.url}
        poster={item.posterUrl ?? undefined}
        loop
        playsInline
        muted={muted}
        className="h-full w-full object-cover"
        onClick={() => {
          const el = ref.current;
          if (!el) return;
          if (el.paused) {
            void el.play();
            setPlaying(true);
          } else {
            el.pause();
            setPlaying(false);
          }
        }}
      />
      {!playing ? (
        <button
          aria-label="Play video"
          onClick={() => {
            void ref.current?.play();
            setPlaying(true);
          }}
          className="absolute inset-0 grid place-items-center bg-black/20"
        >
          <span className="grid h-16 w-16 place-items-center rounded-full bg-white/90 text-ink-900 shadow-xl">
            <Play className="h-7 w-7 translate-x-0.5 fill-current" />
          </span>
        </button>
      ) : null}
      <button
        aria-label={muted ? "Unmute" : "Mute"}
        onClick={() => setMuted((m) => !m)}
        className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-black/50 text-white backdrop-blur"
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>
    </div>
  );
}

/** Swipeable gallery used by feed posts and package pages. */
export function MediaCarousel({
  items,
  aspect = "aspect-[4/5]",
  className,
  rounded = true,
}: {
  items: MediaItem[];
  aspect?: string;
  className?: string;
  rounded?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const safe = items.length ? items : [{ url: "", kind: "IMAGE" as const }];
  const active = safe[Math.min(index, safe.length - 1)];

  return (
    <div className={cn("relative w-full overflow-hidden bg-ink-100", aspect, rounded && "rounded-2xl", className)}>
      <SingleMedia item={active} rounded={false} className="h-full w-full" />

      {safe.length > 1 ? (
        <>
          <button
            aria-label="Previous"
            onClick={() => setIndex((i) => (i - 1 + safe.length) % safe.length)}
            className="absolute left-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-ink-800 shadow hover:bg-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            aria-label="Next"
            onClick={() => setIndex((i) => (i + 1) % safe.length)}
            className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-ink-800 shadow hover:bg-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/35 px-2 py-1.5 backdrop-blur">
            {safe.map((item, i) => (
              <button
                key={`${item.url}-${i}`}
                aria-label={`Go to media ${i + 1}`}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index ? "w-5 bg-white" : "w-1.5 bg-white/60",
                )}
              />
            ))}
          </div>
          <span className="absolute right-3 top-3 rounded-full bg-black/50 px-2 py-1 text-[11px] font-bold text-white backdrop-blur">
            {index + 1}/{safe.length}
          </span>
        </>
      ) : null}
    </div>
  );
}
