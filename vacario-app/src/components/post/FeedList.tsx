"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LoaderCircle, Sparkles, Users } from "lucide-react";
import { PostCard } from "./PostCard";
import { EmptyState, Button } from "@/components/ui";
import type { FeedPost } from "@/lib/serialize";
import { cn } from "@/lib/utils";

type Props = {
  initialPosts: FeedPost[];
  initialCursor: string | null;
  signedIn: boolean;
  showTabs?: boolean;
  type?: string;
  username?: string;
};

export function FeedList({ initialPosts, initialCursor, signedIn, showTabs = false, type, username }: Props) {
  const [scope, setScope] = useState<"foryou" | "following">("foryou");
  const [posts, setPosts] = useState(initialPosts);
  const [cursor, setCursor] = useState(initialCursor);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sentinel = useRef<HTMLDivElement>(null);

  const query = useCallback(
    (next: string | null) => {
      const params = new URLSearchParams();
      if (next) params.set("cursor", next);
      if (type) params.set("type", type);
      if (username) params.set("username", username);
      if (scope === "following") params.set("scope", "following");
      return `/api/posts?${params.toString()}`;
    },
    [scope, type, username],
  );

  const loadMore = useCallback(async () => {
    if (loading || !cursor) return;
    setLoading(true);
    const res = await fetch(query(cursor));
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error ?? "Could not load more posts");
    setPosts((current) => [...current, ...data.posts]);
    setCursor(data.nextCursor);
  }, [cursor, loading, query]);

  // switch tab → reload the feed from the top
  useEffect(() => {
    if (!showTabs) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(
      `/api/posts?${new URLSearchParams(scope === "following" ? { scope: "following" } : {}).toString()}`,
    )
      .then(async (res) => ({ ok: res.ok, data: await res.json() }))
      .then(({ ok, data }) => {
        if (cancelled) return;
        if (!ok) {
          setError(data.error ?? "Could not load the feed");
          setPosts([]);
          return;
        }
        setPosts(data.posts);
        setCursor(data.nextCursor);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [scope, showTabs]);

  useEffect(() => {
    const node = sentinel.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => entries[0]?.isIntersecting && void loadMore(),
      { rootMargin: "600px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="space-y-5">
      {showTabs ? (
        <div className="flex gap-2">
          {(
            [
              { key: "foryou", label: "For you", icon: Sparkles },
              { key: "following", label: "Following", icon: Users },
            ] as const
          ).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setScope(key)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition",
                scope === key ? "vc-sunset text-white shadow-lg shadow-brand-500/20" : "bg-white text-ink-500 ring-1 ring-ink-100 hover:text-ink-800",
              )}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>
      ) : null}

      {error ? (
        <EmptyState
          emoji="🌧️"
          title="Couldn't load that feed"
          body={error}
          action={
            signedIn ? undefined : (
              <Button href="/login" size="sm">
                Log in
              </Button>
            )
          }
        />
      ) : null}

      {!error && posts.length === 0 && !loading ? (
        <EmptyState
          emoji={scope === "following" ? "👀" : "🧭"}
          title={scope === "following" ? "Your following feed is quiet" : "Nothing here yet"}
          body={
            scope === "following"
              ? "Follow a few travellers and their trips will show up here."
              : "Be the first to post a trip — photos, a reel or a full itinerary."
          }
          action={
            <Button href={scope === "following" ? "/explore" : "/create"} size="sm">
              {scope === "following" ? "Find travellers" : "Create a post"}
            </Button>
          }
        />
      ) : null}

      {posts.map((post) => (
        <PostCard key={post.id} post={post} signedIn={signedIn} />
      ))}

      <div ref={sentinel} />

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-6 text-sm font-semibold text-ink-400">
          <LoaderCircle className="h-4 w-4 animate-spin" /> Loading trips…
        </div>
      ) : null}

      {!cursor && posts.length > 0 ? (
        <p className="py-6 text-center text-xs font-semibold uppercase tracking-wide text-ink-300">
          You&apos;re all caught up ✨
        </p>
      ) : null}
    </div>
  );
}
