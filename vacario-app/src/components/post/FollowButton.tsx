"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

export function FollowButton({
  username,
  initialFollowing,
  initialFollowers,
  signedIn,
  size = "md",
}: {
  username: string;
  initialFollowing: boolean;
  initialFollowers: number;
  signedIn: boolean;
  size?: "sm" | "md";
}) {
  const router = useRouter();
  const [following, setFollowing] = useState(initialFollowing);
  const [followers, setFollowers] = useState(initialFollowers);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (!signedIn) return router.push(`/login?next=/u/${username}`);
    setBusy(true);
    const res = await fetch("/api/follow", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) return;
    setFollowing(data.following);
    setFollowers(data.followers);
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={cn(
        "inline-flex items-center gap-2 rounded-full font-bold transition disabled:opacity-60",
        size === "sm" ? "px-3.5 py-1.5 text-xs" : "px-5 py-2.5 text-sm",
        following
          ? "border border-ink-200 bg-white text-ink-700 hover:border-rose-200 hover:text-rose-600"
          : "vc-sunset text-white shadow-lg shadow-brand-500/25",
      )}
    >
      {following ? <Check className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
      {following ? "Following" : "Follow"}
      <span className="opacity-70">· {followers}</span>
    </button>
  );
}
