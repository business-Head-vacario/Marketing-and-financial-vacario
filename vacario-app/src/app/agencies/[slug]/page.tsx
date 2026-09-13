import Link from "next/link";
import { notFound } from "next/navigation";
import { Award, Building, Clock, Globe, Mail, MapPin, Phone, ShieldCheck, Star, Users } from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { PackageCard, PostTile, type PackageCardData } from "@/components/cards";
import { FollowButton } from "@/components/post/FollowButton";
import { Avatar, Badge, Button, EmptyState, VerifiedTick } from "@/components/ui";
import { cn, formatDate, parseList } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const agency = await db.agency.findUnique({ where: { slug }, select: { name: true, tagline: true } });
  return agency ? { title: agency.name, description: agency.tagline } : { title: "Agency not found" };
}

const TABS = ["packages", "portfolio", "reviews", "about"] as const;

export default async function AgencyPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { slug } = await params;
  const { tab = "packages" } = await searchParams;
  const activeTab = (TABS as readonly string[]).includes(tab) ? tab : "packages";
  const viewer = await getCurrentUser();

  const agency = await db.agency.findUnique({
    where: { slug },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
          _count: { select: { followers: true } },
        },
      },
      packages: {
        where: viewer ? {} : { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        include: { agency: { select: { name: true, slug: true, status: true } }, reviews: { select: { rating: true } } },
      },
      reviews: {
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, username: true, avatarUrl: true } }, package: { select: { title: true, slug: true } } },
      },
      _count: { select: { bookings: true, packages: true } },
    },
  });
  if (!agency) notFound();

  const [posts, following] = await Promise.all([
    db.post.findMany({
      where: { authorId: agency.ownerId },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: {
        id: true,
        type: true,
        caption: true,
        media: { orderBy: { order: "asc" }, take: 1, select: { url: true, kind: true, posterUrl: true } },
        _count: { select: { likes: true, comments: true } },
      },
    }),
    viewer
      ? db.follow.findUnique({ where: { followerId_followingId: { followerId: viewer.id, followingId: agency.ownerId } } })
      : Promise.resolve(null),
  ]);

  const published = agency.packages.filter((pkg) => pkg.status === "PUBLISHED");
  const ratings = agency.reviews.map((review) => review.rating);
  const rating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null;
  const specialties = parseList(agency.specialties);
  const languages = parseList(agency.languages);
  const isOwner = viewer?.id === agency.ownerId;

  return (
    <div className="mx-auto w-full max-w-6xl px-3 sm:px-4">
      <div className="vc-card overflow-hidden">
        <div
          className="h-44 w-full bg-cover bg-center vc-lagoon sm:h-60"
          style={agency.coverUrl ? { backgroundImage: `url(${agency.coverUrl})` } : undefined}
        />
        <div className="px-5 pb-5">
          <div className="-mt-12 flex flex-wrap items-end gap-4">
            <span className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-3xl border-4 border-white bg-white shadow-xl">
              {agency.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={agency.logoUrl} alt={agency.name} className="h-full w-full object-cover" />
              ) : (
                <span className="grid h-full w-full place-items-center vc-sunset font-display text-3xl font-black text-white">
                  {agency.name.slice(0, 1)}
                </span>
              )}
            </span>
            <div className="min-w-0 flex-1 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl font-black tracking-tight text-ink-900 sm:text-3xl">{agency.name}</h1>
                {agency.status === "VERIFIED" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-lagoon-100 px-2.5 py-1 text-[11px] font-black text-lagoon-700">
                    <VerifiedTick className="h-3.5 w-3.5" /> Verified agency
                  </span>
                ) : agency.status === "PENDING" ? (
                  <Badge tone="amber">Verification pending</Badge>
                ) : (
                  <Badge tone="rose">Not verified</Badge>
                )}
              </div>
              <p className="text-sm text-ink-500">{agency.tagline || `Travel agency in ${agency.city}`}</p>
            </div>
            <div className="flex gap-2 pb-1">
              {isOwner ? (
                <>
                  <Button href="/dashboard" size="sm" variant="outline">
                    Dashboard
                  </Button>
                  <Button href="/dashboard/packages/new" size="sm">
                    New package
                  </Button>
                </>
              ) : (
                <FollowButton
                  username={agency.owner.username}
                  initialFollowing={Boolean(following)}
                  initialFollowers={agency.owner._count.followers}
                  signedIn={Boolean(viewer)}
                />
              )}
            </div>
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Packages", value: published.length, icon: Globe, tone: "text-brand-600" },
              { label: "Bookings", value: agency._count.bookings, icon: Users, tone: "text-lagoon-600" },
              { label: "Rating", value: rating ? `${rating.toFixed(1)}★` : "New", icon: Star, tone: "text-amber-600" },
              { label: "Experience", value: `${agency.yearsInBusiness} yrs`, icon: Award, tone: "text-violet-600" },
            ].map(({ label, value, icon: Icon, tone }) => (
              <div key={label} className="rounded-2xl border border-ink-100 bg-white px-4 py-3">
                <Icon className={cn("mb-1 h-4 w-4", tone)} />
                <dt className="font-display text-xl font-black text-ink-900">{value}</dt>
                <dd className="text-[11px] font-bold uppercase tracking-wide text-ink-400">{label}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-ink-500">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-brand-500" /> {agency.city}, {agency.country}
            </span>
            <a href={`tel:${agency.phone}`} className="inline-flex items-center gap-1 hover:text-brand-600">
              <Phone className="h-3.5 w-3.5 text-brand-500" /> {agency.phone}
            </a>
            <a href={`mailto:${agency.email}`} className="inline-flex items-center gap-1 hover:text-brand-600">
              <Mail className="h-3.5 w-3.5 text-brand-500" /> {agency.email}
            </a>
            {agency.website ? (
              <a
                href={agency.website.startsWith("http") ? agency.website : `https://${agency.website}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-brand-600 hover:underline"
              >
                <Globe className="h-3.5 w-3.5" /> {agency.website}
              </a>
            ) : null}
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-brand-500" /> On Vacario since {formatDate(agency.createdAt)}
            </span>
          </div>

          {specialties.length ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {specialties.map((item) => (
                <Badge key={item} tone="lagoon">
                  {item}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <nav className="my-5 flex gap-2 overflow-x-auto vc-scroll-hide">
        {TABS.map((key) => (
          <Link
            key={key}
            href={`/agencies/${agency.slug}?tab=${key}`}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-bold capitalize transition",
              activeTab === key ? "vc-sunset text-white shadow" : "bg-white text-ink-500 ring-1 ring-ink-100 hover:text-ink-800",
            )}
          >
            {key}
          </Link>
        ))}
      </nav>

      {activeTab === "packages" ? (
        agency.packages.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {agency.packages.map((pkg) => {
              const packageRatings = pkg.reviews.map((review) => review.rating);
              return (
                <div key={pkg.id} className="relative">
                  {pkg.status !== "PUBLISHED" ? (
                    <span className="absolute right-3 top-3 z-10">
                      <Badge tone="slate">{pkg.status.toLowerCase()}</Badge>
                    </span>
                  ) : null}
                  <PackageCard
                    pkg={{
                      ...(pkg as unknown as PackageCardData),
                      rating: packageRatings.length ? packageRatings.reduce((a, b) => a + b, 0) / packageRatings.length : null,
                      reviewCount: packageRatings.length,
                    }}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            emoji="🧳"
            title="No packages published yet"
            body={isOwner ? "Publish your first package to start taking bookings." : "This agency hasn't listed a trip yet."}
            action={isOwner ? <Button href="/dashboard/packages/new">Create a package</Button> : undefined}
          />
        )
      ) : null}

      {activeTab === "portfolio" ? (
        posts.length ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {posts.map((post) => (
              <PostTile key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <EmptyState emoji="📷" title="No portfolio posts yet" body="Photos, reels and 360° shots from this agency's trips will appear here." />
        )
      ) : null}

      {activeTab === "reviews" ? (
        agency.reviews.length ? (
          <ul className="space-y-3">
            {agency.reviews.map((review) => (
              <li key={review.id} className="vc-card flex gap-4 p-5">
                <Avatar name={review.user.name} src={review.user.avatarUrl} size={44} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/u/${review.user.username}`} className="text-sm font-black text-ink-900 hover:text-brand-600">
                      {review.user.name}
                    </Link>
                    <span className="flex text-amber-500">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-current" />
                      ))}
                    </span>
                    <span className="text-[11px] text-ink-400">{formatDate(review.createdAt)}</span>
                  </div>
                  {review.package ? (
                    <Link href={`/packages/${review.package.slug}`} className="text-xs font-bold text-lagoon-600 hover:underline">
                      {review.package.title}
                    </Link>
                  ) : null}
                  <p className="mt-1 text-sm text-ink-700">{review.body}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState emoji="⭐" title="No reviews yet" body="Reviews appear here once travellers complete a trip with this agency." />
        )
      ) : null}

      {activeTab === "about" ? (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="vc-card p-6">
            <h2 className="mb-3 font-display text-lg font-black">About {agency.name}</h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-ink-700">
              {agency.about || "This agency hasn't written an about section yet."}
            </p>
            {languages.length ? (
              <>
                <h3 className="mt-5 text-xs font-black uppercase tracking-wide text-ink-400">Languages</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {languages.map((language) => (
                    <Badge key={language} tone="slate">
                      {language}
                    </Badge>
                  ))}
                </div>
              </>
            ) : null}
          </section>

          <aside className="space-y-4">
            <div className="vc-card p-5">
              <h3 className="mb-3 flex items-center gap-2 font-display text-base font-black">
                <ShieldCheck className="h-4 w-4 text-lagoon-600" /> Credentials
              </h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-400">Status</dt>
                  <dd className="font-bold text-ink-800">{agency.status.toLowerCase()}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-400">Licence</dt>
                  <dd className="font-bold text-ink-800">{agency.licenseNo || "—"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-400">GST</dt>
                  <dd className="font-bold text-ink-800">{agency.gstNo || "—"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-400">Team</dt>
                  <dd className="font-bold text-ink-800">{agency.teamSize} people</dd>
                </div>
              </dl>
            </div>

            <div className="vc-card p-5">
              <h3 className="mb-2 flex items-center gap-2 font-display text-base font-black">
                <Building className="h-4 w-4 text-brand-500" /> Office
              </h3>
              <p className="text-sm text-ink-600">
                {agency.address || `${agency.city}, ${agency.country}`}
              </p>
              <Link href={`/u/${agency.owner.username}`} className="mt-3 flex items-center gap-2 rounded-2xl bg-ink-50 p-2.5">
                <Avatar name={agency.owner.name} src={agency.owner.avatarUrl} size={34} />
                <span className="min-w-0">
                  <span className="block truncate text-xs font-black text-ink-900">{agency.owner.name}</span>
                  <span className="block text-[11px] text-ink-400">Account manager</span>
                </span>
              </Link>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
