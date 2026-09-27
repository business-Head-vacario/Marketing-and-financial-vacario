import Link from "next/link";
import { notFound } from "next/navigation";
import { Building, Globe, Grid3x3, MapPin, Rotate3d, Route, Settings, Bookmark } from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { PostTile, ItineraryCard } from "@/components/cards";
import { FollowButton } from "@/components/post/FollowButton";
import { Avatar, Badge, Button, EmptyState, VerifiedTick } from "@/components/ui";
import { cn, parseList } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const user = await db.user.findUnique({ where: { username }, select: { name: true, bio: true } });
  return user ? { title: `${user.name} (@${username})`, description: user.bio ?? undefined } : { title: "Profile not found" };
}

const TABS = [
  { key: "posts", label: "Posts", icon: Grid3x3 },
  { key: "threesixty", label: "360°", icon: Rotate3d },
  { key: "itineraries", label: "Itineraries", icon: Route },
  { key: "saved", label: "Saved", icon: Bookmark },
] as const;

export default async function ProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { username } = await params;
  const { tab = "posts" } = await searchParams;
  const viewer = await getCurrentUser();

  const user = await db.user.findUnique({
    where: { username },
    include: {
      agency: { select: { name: true, slug: true, status: true, city: true, tagline: true, logoUrl: true, _count: { select: { packages: true } } } },
      _count: { select: { posts: true, followers: true, following: true, itineraries: true } },
    },
  });
  if (!user) notFound();

  const isSelf = viewer?.id === user.id;
  const activeTab = tab === "saved" && !isSelf ? "posts" : tab;

  const [following, posts, itineraries, saved] = await Promise.all([
    viewer && !isSelf
      ? db.follow.findUnique({ where: { followerId_followingId: { followerId: viewer.id, followingId: user.id } } })
      : Promise.resolve(null),
    activeTab === "posts" || activeTab === "threesixty"
      ? db.post.findMany({
          where: { authorId: user.id, ...(activeTab === "threesixty" ? { type: "THREESIXTY" } : {}) },
          orderBy: { createdAt: "desc" },
          take: 36,
          select: {
            id: true,
            type: true,
            caption: true,
            media: { orderBy: { order: "asc" }, take: 2, select: { url: true, kind: true, posterUrl: true } },
            _count: { select: { likes: true, comments: true } },
          },
        })
      : Promise.resolve([]),
    activeTab === "itineraries"
      ? db.itinerary.findMany({
          where: { authorId: user.id, ...(isSelf ? {} : { isPublic: true }) },
          orderBy: { createdAt: "desc" },
          include: { author: { select: { name: true, username: true, avatarUrl: true } } },
        })
      : Promise.resolve([]),
    activeTab === "saved" && isSelf
      ? db.save.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: "desc" },
          take: 36,
          select: {
            post: {
              select: {
                id: true,
                type: true,
                caption: true,
                media: { orderBy: { order: "asc" }, take: 2, select: { url: true, kind: true, posterUrl: true } },
                _count: { select: { likes: true, comments: true } },
              },
            },
          },
        })
      : Promise.resolve([]),
  ]);

  const interests = parseList(user.interests);

  return (
    <div className="mx-auto w-full max-w-5xl px-3 sm:px-4">
      <div className="vc-card overflow-hidden">
        <div
          className="h-40 w-full bg-cover bg-center vc-sunset sm:h-52"
          style={user.coverUrl ? { backgroundImage: `url(${user.coverUrl})` } : undefined}
        />
        <div className="px-5 pb-5">
          <div className="-mt-12 flex flex-wrap items-end gap-4">
            <Avatar name={user.name} src={user.avatarUrl} size={104} ring className="shadow-xl" />
            <div className="min-w-0 flex-1 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl font-black tracking-tight text-ink-900">{user.name}</h1>
                {user.agency?.status === "VERIFIED" ? <VerifiedTick className="h-5 w-5" /> : null}
                {user.role === "AGENT" ? <Badge tone="lagoon">Travel agent</Badge> : null}
                {user.role === "ADMIN" ? <Badge tone="violet">Admin</Badge> : null}
              </div>
              <p className="text-sm text-ink-400">@{user.username}</p>
            </div>
            <div className="flex gap-2 pb-1">
              {isSelf ? (
                <>
                  <Button href="/settings" variant="outline" size="sm">
                    <Settings className="h-4 w-4" /> Edit profile
                  </Button>
                  <Button href="/create" size="sm">
                    New post
                  </Button>
                </>
              ) : (
                <FollowButton
                  username={user.username}
                  initialFollowing={Boolean(following)}
                  initialFollowers={user._count.followers}
                  signedIn={Boolean(viewer)}
                />
              )}
            </div>
          </div>

          {user.bio ? <p className="mt-4 max-w-2xl whitespace-pre-line text-sm text-ink-700">{user.bio}</p> : null}

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-ink-500">
            {user.homeCity ? (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-brand-500" /> {user.homeCity}
                {user.country ? `, ${user.country}` : ""}
              </span>
            ) : null}
            {user.website ? (
              <a href={user.website.startsWith("http") ? user.website : `https://${user.website}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-brand-600 hover:underline">
                <Globe className="h-3.5 w-3.5" /> {user.website}
              </a>
            ) : null}
            {user.travelStyle ? <Badge tone="amber">{user.travelStyle}</Badge> : null}
          </div>

          {interests.length ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {interests.map((interest) => (
                <Badge key={interest} tone="slate">
                  {interest}
                </Badge>
              ))}
            </div>
          ) : null}

          <dl className="mt-4 flex gap-6">
            {[
              [user._count.posts, "posts"],
              [user._count.followers, "followers"],
              [user._count.following, "following"],
              [user._count.itineraries, "itineraries"],
            ].map(([value, label]) => (
              <div key={label as string}>
                <dt className="font-display text-lg font-black text-ink-900">{value as number}</dt>
                <dd className="text-[11px] uppercase tracking-wide text-ink-400">{label as string}</dd>
              </div>
            ))}
          </dl>

          {user.agency ? (
            <Link
              href={`/agencies/${user.agency.slug}`}
              className="mt-4 flex items-center gap-3 rounded-2xl border border-lagoon-200 bg-lagoon-50 p-3 transition hover:border-lagoon-300"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-white">
                {user.agency.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.agency.logoUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <Building className="h-5 w-5 text-lagoon-600" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1 text-sm font-black text-ink-900">
                  {user.agency.name}
                  {user.agency.status === "VERIFIED" ? <VerifiedTick className="h-3.5 w-3.5" /> : null}
                </span>
                <span className="block truncate text-xs text-ink-500">
                  {user.agency.tagline || `Travel agency in ${user.agency.city}`} · {user.agency._count.packages} packages
                </span>
              </span>
              <span className="text-xs font-black text-lagoon-700">View portfolio →</span>
            </Link>
          ) : null}
        </div>
      </div>

      <nav className="my-5 flex gap-2 overflow-x-auto vc-scroll-hide">
        {TABS.filter((t) => t.key !== "saved" || isSelf).map(({ key, label, icon: Icon }) => (
          <Link
            key={key}
            href={`/u/${user.username}?tab=${key}`}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition",
              activeTab === key ? "vc-sunset text-white shadow" : "bg-white text-ink-500 ring-1 ring-ink-100 hover:text-ink-800",
            )}
          >
            <Icon className="h-4 w-4" /> {label}
          </Link>
        ))}
      </nav>

      {activeTab === "itineraries" ? (
        itineraries.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {itineraries.map((itinerary) => (
              <ItineraryCard key={itinerary.id} itinerary={itinerary} />
            ))}
          </div>
        ) : (
          <EmptyState
            emoji="🗺️"
            title="No itineraries yet"
            body={isSelf ? "Turn one of your trips into a day-by-day plan." : "This traveller hasn't published a plan yet."}
            action={isSelf ? <Button href="/itineraries/new">Build an itinerary</Button> : undefined}
          />
        )
      ) : activeTab === "saved" ? (
        saved.length ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {saved.map(({ post }) => (
              <PostTile key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <EmptyState emoji="🔖" title="Nothing saved yet" body="Tap the bookmark on any post to keep it here." />
        )
      ) : posts.length ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {posts.map((post) => (
            <PostTile key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <EmptyState
          emoji="📷"
          title={activeTab === "threesixty" ? "No 360° posts yet" : "No posts yet"}
          body={isSelf ? "Share your first trip — photos, a reel or a 360° view." : "Check back soon."}
          action={isSelf ? <Button href="/create">Create a post</Button> : undefined}
        />
      )}
    </div>
  );
}
