import Link from "next/link";
import { Compass, Search, Users } from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { PostTile } from "@/components/cards";
import { Avatar, Badge, Chip, EmptyState, VerifiedTick } from "@/components/ui";
import { POST_TYPES, POST_TYPE_LABEL, type PostType } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Explore" };

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string; type?: string }>;
}) {
  const { q = "", tag = "", type = "" } = await searchParams;
  const viewer = await getCurrentUser();
  const term = q.trim();

  const where: Record<string, unknown> = {};
  if (POST_TYPES.includes(type as PostType)) where.type = type;
  if (tag) where.tags = { contains: `"${tag}"` };
  if (term) {
    where.OR = [
      { caption: { contains: term } },
      { locationName: { contains: term } },
      { country: { contains: term } },
      { tags: { contains: term } },
      { author: { username: { contains: term } } },
      { author: { name: { contains: term } } },
    ];
  }

  const [posts, people, destinations] = await Promise.all([
    db.post.findMany({
      where,
      orderBy: [{ likes: { _count: "desc" } }, { createdAt: "desc" }],
      take: 36,
      select: {
        id: true,
        type: true,
        caption: true,
        media: { orderBy: { order: "asc" }, take: 2, select: { url: true, kind: true, posterUrl: true } },
        _count: { select: { likes: true, comments: true } },
      },
    }),
    term
      ? db.user.findMany({
          where: { OR: [{ username: { contains: term } }, { name: { contains: term } }, { homeCity: { contains: term } }] },
          take: 6,
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
            homeCity: true,
            agency: { select: { status: true, name: true, slug: true } },
            _count: { select: { followers: true } },
          },
        })
      : Promise.resolve([]),
    db.post.groupBy({
      by: ["locationName"],
      where: { locationName: { not: null } },
      _count: { locationName: true },
      orderBy: { _count: { locationName: "desc" } },
      take: 12,
    }),
  ]);

  const queryString = (patch: Record<string, string>) => {
    const params = new URLSearchParams();
    const merged = { q: term, tag, type, ...patch };
    Object.entries(merged).forEach(([key, value]) => value && params.set(key, value));
    const qs = params.toString();
    return qs ? `/explore?${qs}` : "/explore";
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-3 sm:px-4">
      <div className="overflow-hidden rounded-[2rem] vc-sunset px-6 py-8 text-white">
        <h1 className="font-display text-3xl font-black sm:text-4xl">
          {term ? (
            <>
              Results for <span className="underline decoration-white/40">{term}</span>
            </>
          ) : (
            "Explore the world, one post at a time"
          )}
        </h1>
        <p className="mt-1 text-sm text-white/85">
          Search a place, a traveller, or a #tag — then filter by photos, reels, 360° or itineraries.
        </p>
        <form action="/explore" className="mt-4 flex max-w-xl gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              name="q"
              defaultValue={term}
              placeholder="Ladakh, scuba, @ananya, #roadtrip…"
              className="w-full rounded-full border-0 bg-white/95 py-3 pl-11 pr-4 text-sm text-ink-900 outline-none placeholder:text-ink-300"
            />
          </div>
          <button className="rounded-full bg-ink-900 px-5 text-sm font-bold text-white">Search</button>
        </form>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href={queryString({ type: "" })}>
          <Chip active={!type}>
            <Compass className="h-3.5 w-3.5" /> Everything
          </Chip>
        </Link>
        {POST_TYPES.map((postType) => (
          <Link key={postType} href={queryString({ type: postType })}>
            <Chip active={type === postType}>{POST_TYPE_LABEL[postType]}</Chip>
          </Link>
        ))}
        {tag ? (
          <Link href={queryString({ tag: "" })}>
            <Chip active>#{tag} ✕</Chip>
          </Link>
        ) : null}
      </div>

      {people.length ? (
        <section>
          <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-black">
            <Users className="h-4 w-4 text-brand-500" /> People & agencies
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {people.map((person) => (
              <Link key={person.id} href={`/u/${person.username}`} className="vc-card flex items-center gap-3 p-3 transition hover:shadow-lg">
                <Avatar name={person.name} src={person.avatarUrl} size={46} ring />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 truncate text-sm font-bold text-ink-900">
                    {person.name}
                    {person.agency?.status === "VERIFIED" ? <VerifiedTick className="h-3.5 w-3.5" /> : null}
                  </div>
                  <div className="truncate text-xs text-ink-400">
                    @{person.username}
                    {person.homeCity ? ` · ${person.homeCity}` : ""}
                  </div>
                </div>
                {person.agency ? <Badge tone="lagoon">Agency</Badge> : <Badge tone="slate">{person._count.followers} followers</Badge>}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {!term && destinations.length ? (
        <section>
          <h2 className="mb-3 font-display text-lg font-black">Popular right now</h2>
          <div className="flex flex-wrap gap-2">
            {destinations.map((destination) => (
              <Link key={destination.locationName} href={`/explore?q=${encodeURIComponent(destination.locationName ?? "")}`}>
                <Chip>
                  📍 {destination.locationName}
                  <span className="text-ink-400">{destination._count.locationName}</span>
                </Chip>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <h2 className="mb-3 font-display text-lg font-black">
          {posts.length} {posts.length === 1 ? "post" : "posts"}
        </h2>
        {posts.length ? (
          <div className={cn("grid gap-2 sm:gap-3", "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4")}>
            {posts.map((post) => (
              <PostTile key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <EmptyState
            emoji="🔍"
            title="Nothing matched that search"
            body="Try a different destination, tag or traveller — or be the first to post about it."
          />
        )}
      </section>

      {!viewer ? (
        <div className="vc-card flex flex-wrap items-center justify-between gap-3 p-5">
          <p className="text-sm font-semibold text-ink-700">Like what you see? Join Vacario and start posting your own trips.</p>
          <Link href="/signup" className="rounded-full vc-sunset px-5 py-2.5 text-sm font-bold text-white shadow">
            Create free account
          </Link>
        </div>
      ) : null}
    </div>
  );
}
