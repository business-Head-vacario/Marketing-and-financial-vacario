import Link from "next/link";
import { Rotate3d, Upload } from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { postInclude, toFeedPost } from "@/lib/serialize";
import { Panorama } from "@/components/media/Panorama";
import { Avatar, Button, EmptyState, VerifiedTick } from "@/components/ui";
import { timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "360° World" };

export default async function ThreeSixtyPage() {
  const viewer = await getCurrentUser();
  const posts = await db.post.findMany({
    where: { type: "THREESIXTY" },
    include: postInclude(viewer?.id),
    orderBy: { createdAt: "desc" },
    take: 18,
  });
  const feed = posts.map(toFeedPost);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-3 sm:px-4">
      <section className="relative overflow-hidden rounded-[2rem] bg-ink-900 px-6 py-10 text-white">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-lagoon-500/30 blur-3xl vc-float" />
        <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.2em]">
            <Rotate3d className="h-3.5 w-3.5" /> Immersive
          </span>
          <h1 className="mt-3 font-display text-4xl font-black leading-tight sm:text-5xl">Stand where they stood.</h1>
          <p className="mt-2 max-w-lg text-sm text-white/75">
            Drag any frame below to look around the whole scene. Upload an equirectangular photo (2:1) from a 360°
            camera or your phone&apos;s panorama mode and it becomes explorable here.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button href="/create?type=THREESIXTY" size="lg">
              <Upload className="h-4 w-4" /> Upload a 360° shot
            </Button>
            <Link
              href="/explore?type=THREESIXTY"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-base font-bold text-white transition hover:bg-white/20"
            >
              Browse all
            </Link>
          </div>
        </div>
      </section>

      {feed.length ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {feed.map((post) => (
            <article key={post.id} className="vc-card overflow-hidden">
              <Panorama src={post.media[0]?.url ?? ""} className="aspect-[16/10] w-full" />
              <div className="space-y-2 p-4">
                <div className="flex items-center gap-2">
                  <Avatar name={post.author.name} src={post.author.avatarUrl} size={34} ring />
                  <Link href={`/u/${post.author.username}`} className="flex items-center gap-1 text-sm font-bold hover:text-brand-600">
                    {post.author.name}
                    {post.author.agencyVerified ? <VerifiedTick className="h-3.5 w-3.5" /> : null}
                  </Link>
                  <span className="text-xs text-ink-400">· {timeAgo(post.createdAt)}</span>
                  <Link href={`/p/${post.id}`} className="ml-auto text-xs font-black text-brand-600 hover:underline">
                    Open
                  </Link>
                </div>
                {post.caption ? <p className="line-clamp-2 text-sm text-ink-600">{post.caption}</p> : null}
                {post.locationName ? (
                  <p className="text-xs font-bold text-lagoon-700">📍 {post.locationName}{post.country ? `, ${post.country}` : ""}</p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          emoji="🌐"
          title="No 360° posts yet"
          body="Upload an equirectangular panorama and it will be explorable right here."
          action={<Button href="/create?type=THREESIXTY">Upload a 360° shot</Button>}
        />
      )}
    </div>
  );
}
