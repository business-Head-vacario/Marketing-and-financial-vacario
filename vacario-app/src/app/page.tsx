import Link from "next/link";
import { ArrowRight, Flame, Rotate3d, Route, Sparkles, Ticket, TrendingUp } from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { postInclude, toFeedPost } from "@/lib/serialize";
import { FeedList } from "@/components/post/FeedList";
import { PackageCard, type PackageCardData } from "@/components/cards";
import { Avatar, Badge, Button, VerifiedTick } from "@/components/ui";
import { money } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function trendingDestinations() {
  const rows = await db.post.groupBy({
    by: ["locationName"],
    where: { locationName: { not: null } },
    _count: { locationName: true },
    orderBy: { _count: { locationName: "desc" } },
    take: 8,
  });
  return rows.filter((row) => row.locationName).map((row) => ({ name: row.locationName as string, posts: row._count.locationName }));
}

export default async function HomePage() {
  const viewer = await getCurrentUser();

  const [posts, storytellers, destinations, promoted, suggestions, counts] = await Promise.all([
    db.post.findMany({ include: postInclude(viewer?.id), orderBy: { createdAt: "desc" }, take: 8 }),
    db.user.findMany({
      where: { posts: { some: {} } },
      orderBy: { posts: { _count: "desc" } },
      take: 14,
      select: { id: true, name: true, username: true, avatarUrl: true, agency: { select: { status: true } } },
    }),
    trendingDestinations(),
    db.package.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ discountPercent: "desc" }, { createdAt: "desc" }],
      take: 3,
      include: { agency: { select: { name: true, slug: true, status: true, city: true } } },
    }),
    db.user.findMany({
      where: {
        id: { not: viewer?.id ?? "" },
        ...(viewer ? { followers: { none: { followerId: viewer.id } } } : {}),
      },
      orderBy: { followers: { _count: "desc" } },
      take: 4,
      select: {
        id: true,
        name: true,
        username: true,
        avatarUrl: true,
        homeCity: true,
        agency: { select: { name: true, status: true } },
        _count: { select: { followers: true, posts: true } },
      },
    }),
    Promise.all([db.post.count(), db.itinerary.count(), db.package.count(), db.agency.count()]),
  ]);

  const [postCount, itineraryCount, packageCount, agencyCount] = counts;

  return (
    <div className="mx-auto w-full max-w-6xl px-3 sm:px-4">
      {!viewer ? (
        <section className="relative mb-6 overflow-hidden rounded-[2rem] vc-sunset px-6 py-10 text-white sm:px-10 sm:py-14">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/15 blur-3xl vc-float" />
          <div className="absolute -bottom-28 left-10 h-72 w-72 rounded-full bg-lagoon-300/30 blur-3xl" />
          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-black uppercase tracking-[0.2em]">
              <Sparkles className="h-3.5 w-3.5" /> Travel social, done properly
            </span>
            <h1 className="mt-4 font-display text-4xl font-black leading-[1.05] sm:text-6xl">
              Every trip you scroll past
              <br />
              is a trip you can book.
            </h1>
            <p className="mt-4 max-w-xl text-sm text-white/90 sm:text-base">
              Photos, reels and drag-to-explore 360° views. Day-by-day itineraries with real costs. Verified travel
              agencies whose packages you can book without leaving the feed.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-base font-bold text-brand-600 shadow-lg transition hover:bg-white/90"
              >
                Join free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3.5 text-base font-bold text-white transition hover:bg-white/20"
              >
                Explore trips
              </Link>
              <Link
                href="/onboarding/agent"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-base font-bold text-white transition hover:bg-white/15"
              >
                List your agency
              </Link>
            </div>
            <dl className="mt-8 flex flex-wrap gap-6">
              {[
                [postCount, "trips shared"],
                [itineraryCount, "itineraries"],
                [packageCount, "bookable packages"],
                [agencyCount, "agencies"],
              ].map(([value, label]) => (
                <div key={label as string}>
                  <dt className="font-display text-2xl font-black">{value as number}</dt>
                  <dd className="text-[11px] uppercase tracking-wide text-white/75">{label as string}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          {/* stories rail */}
          {storytellers.length ? (
            <div className="mb-5 flex gap-4 overflow-x-auto vc-scroll-hide rounded-3xl border border-ink-100 bg-white/80 p-4">
              {viewer ? (
                <Link href="/create" className="flex w-16 shrink-0 flex-col items-center gap-1.5">
                  <span className="grid h-16 w-16 place-items-center rounded-full border-2 border-dashed border-brand-300 text-2xl text-brand-500">
                    +
                  </span>
                  <span className="w-full truncate text-center text-[11px] font-bold text-ink-600">Your trip</span>
                </Link>
              ) : null}
              {storytellers.map((person) => (
                <Link key={person.id} href={`/u/${person.username}`} className="flex w-16 shrink-0 flex-col items-center gap-1.5">
                  <Avatar name={person.name} src={person.avatarUrl} size={62} ring />
                  <span className="flex w-full items-center justify-center gap-0.5 truncate text-[11px] font-bold text-ink-600">
                    <span className="truncate">{person.username}</span>
                    {person.agency?.status === "VERIFIED" ? <VerifiedTick className="h-3 w-3 shrink-0" /> : null}
                  </span>
                </Link>
              ))}
            </div>
          ) : null}

          <FeedList
            initialPosts={posts.map(toFeedPost)}
            initialCursor={posts.length === 8 ? posts[posts.length - 1].id : null}
            signedIn={Boolean(viewer)}
            showTabs={Boolean(viewer)}
          />
        </div>

        {/* right rail */}
        <aside className="hidden space-y-5 lg:block">
          <div className="vc-card p-4">
            <h3 className="mb-3 flex items-center gap-2 font-display text-sm font-black uppercase tracking-wide text-ink-500">
              <Flame className="h-4 w-4 text-brand-500" /> Trending destinations
            </h3>
            <ul className="space-y-1.5">
              {destinations.length ? (
                destinations.map((destination, index) => (
                  <li key={destination.name}>
                    <Link
                      href={`/explore?q=${encodeURIComponent(destination.name)}`}
                      className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-brand-50"
                    >
                      <span className="font-display text-sm font-black text-ink-300">{index + 1}</span>
                      <span className="min-w-0 flex-1 truncate text-sm font-bold text-ink-800">{destination.name}</span>
                      <span className="text-[11px] font-semibold text-ink-400">{destination.posts} posts</span>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="px-2 text-sm text-ink-400">No trips tagged yet.</li>
              )}
            </ul>
          </div>

          <div className="vc-card p-4">
            <h3 className="mb-3 flex items-center gap-2 font-display text-sm font-black uppercase tracking-wide text-ink-500">
              <TrendingUp className="h-4 w-4 text-lagoon-500" /> Travellers to follow
            </h3>
            <ul className="space-y-3">
              {suggestions.map((person) => (
                <li key={person.id} className="flex items-center gap-3">
                  <Avatar name={person.name} src={person.avatarUrl} size={40} />
                  <div className="min-w-0 flex-1">
                    <Link href={`/u/${person.username}`} className="flex items-center gap-1 truncate text-sm font-bold text-ink-900 hover:text-brand-600">
                      {person.name}
                      {person.agency?.status === "VERIFIED" ? <VerifiedTick className="h-3.5 w-3.5" /> : null}
                    </Link>
                    <div className="truncate text-[11px] text-ink-400">
                      {person._count.followers} followers · {person._count.posts} posts
                    </div>
                  </div>
                  <Link href={`/u/${person.username}`} className="rounded-full bg-brand-50 px-3 py-1.5 text-[11px] font-black text-brand-600 hover:bg-brand-100">
                    View
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="vc-card overflow-hidden">
            <div className="flex items-center justify-between px-4 pt-4">
              <h3 className="flex items-center gap-2 font-display text-sm font-black uppercase tracking-wide text-ink-500">
                <Ticket className="h-4 w-4 text-brand-500" /> Deals right now
              </h3>
              <Link href="/packages" className="text-[11px] font-black text-brand-600 hover:underline">
                See all
              </Link>
            </div>
            <div className="space-y-3 p-4">
              {promoted.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg as unknown as PackageCardData} compact />
              ))}
              {!promoted.length ? <p className="text-sm text-ink-400">No packages listed yet.</p> : null}
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl vc-lagoon p-5 text-white">
            <Route className="mb-2 h-6 w-6" />
            <h3 className="font-display text-lg font-black">Plan it, don&apos;t just post it</h3>
            <p className="mt-1 text-xs text-white/85">
              Turn your trip into a day-by-day itinerary with costs — other travellers can copy it in one tap.
            </p>
            <Link href="/itineraries/new" className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-black text-lagoon-700">
              Build an itinerary <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="rounded-3xl border border-brand-200 bg-brand-50 p-5">
            <Rotate3d className="mb-2 h-6 w-6 text-brand-600" />
            <h3 className="font-display text-lg font-black text-ink-900">Post in 360°</h3>
            <p className="mt-1 text-xs text-ink-600">
              Upload an equirectangular photo and let people look around your view — right inside the feed.
            </p>
            <Link href="/threesixty" className="mt-3 inline-flex items-center gap-1.5 text-xs font-black text-brand-700 hover:underline">
              See the 360° world <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <p className="px-2 text-[11px] text-ink-300">
            Vacario · travel social + marketplace ·{" "}
            <Link href="/agencies" className="hover:underline">
              agencies
            </Link>{" "}
            ·{" "}
            <Link href="/packages" className="hover:underline">
              packages
            </Link>{" "}
            ·{" "}
            <Link href="/itineraries" className="hover:underline">
              itineraries
            </Link>
          </p>
        </aside>
      </div>
    </div>
  );
}
