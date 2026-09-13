import Link from "next/link";
import { notFound } from "next/navigation";
import { BedDouble, Check, Clock, MapPin, Star, Users, Utensils, X } from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { MediaCarousel } from "@/components/media/MediaView";
import { PackageBookingBox } from "@/components/PackageBookingBox";
import { PackageCard, type PackageCardData } from "@/components/cards";
import { Avatar, Badge, VerifiedTick } from "@/components/ui";
import { formatDate, parseList, timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pkg = await db.package.findUnique({ where: { slug }, select: { title: true, summary: true } });
  return pkg ? { title: pkg.title, description: pkg.summary } : { title: "Package not found" };
}

export default async function PackagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const viewer = await getCurrentUser();

  const pkg = await db.package.findUnique({
    where: { slug },
    include: {
      agency: {
        include: {
          owner: { select: { username: true, name: true, avatarUrl: true } },
          _count: { select: { packages: true, bookings: true } },
        },
      },
      dayPlans: { orderBy: { dayNumber: "asc" } },
      reviews: {
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { user: { select: { name: true, username: true, avatarUrl: true } } },
      },
      _count: { select: { bookings: true } },
    },
  });
  if (!pkg) notFound();

  const images = parseList(pkg.images);
  const inclusions = parseList(pkg.inclusions);
  const exclusions = parseList(pkg.exclusions);
  const highlights = parseList(pkg.highlights);
  const ratings = pkg.reviews.map((review) => review.rating);
  const rating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null;

  const similar = await db.package.findMany({
    where: { status: "PUBLISHED", id: { not: pkg.id }, OR: [{ destination: pkg.destination }, { category: pkg.category }] },
    take: 3,
    include: { agency: { select: { name: true, slug: true, status: true } } },
  });

  return (
    <div className="mx-auto w-full max-w-6xl px-3 sm:px-4">
      <nav className="mb-3 text-xs font-semibold text-ink-400">
        <Link href="/packages" className="hover:text-brand-600">
          Packages
        </Link>{" "}
        / <span className="text-ink-600">{pkg.destination}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-6">
          <MediaCarousel
            items={images.length ? images.map((url) => ({ url, kind: /\.(mp4|webm)$/i.test(url) ? "VIDEO" : "IMAGE" })) : [{ url: pkg.coverUrl ?? "", kind: "IMAGE" }]}
            aspect="aspect-[16/9]"
          />

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="lagoon">{pkg.category.toLowerCase()}</Badge>
              {pkg.discountPercent > 0 ? <Badge tone="rose">{pkg.discountPercent}% off</Badge> : null}
              {pkg._count.bookings > 0 ? <Badge tone="amber">{pkg._count.bookings} booked</Badge> : null}
              {rating ? (
                <span className="inline-flex items-center gap-1 text-sm font-black text-amber-600">
                  <Star className="h-4 w-4 fill-current" /> {rating.toFixed(1)}
                  <span className="font-semibold text-ink-400">({ratings.length})</span>
                </span>
              ) : null}
            </div>
            <h1 className="mt-2 font-display text-3xl font-black leading-tight tracking-tight sm:text-4xl">{pkg.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold text-ink-500">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4 text-brand-500" /> {pkg.destination}, {pkg.country}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-4 w-4 text-brand-500" /> {pkg.durationDays} days / {pkg.durationNights} nights
              </span>
              <span className="inline-flex items-center gap-1">
                <Users className="h-4 w-4 text-brand-500" /> {pkg.minGuests}–{pkg.maxGuests} guests
              </span>
              {pkg.startCity ? <span>Starts in {pkg.startCity}</span> : null}
            </div>
            {pkg.summary ? <p className="mt-3 text-base text-ink-700">{pkg.summary}</p> : null}
          </div>

          {highlights.length ? (
            <section className="vc-card p-5">
              <h2 className="mb-3 font-display text-lg font-black">Trip highlights</h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-ink-700">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-100 text-[11px] text-brand-600">
                      ★
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {pkg.description ? (
            <section className="vc-card p-5">
              <h2 className="mb-2 font-display text-lg font-black">About this trip</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-ink-700">{pkg.description}</p>
            </section>
          ) : null}

          {pkg.dayPlans.length ? (
            <section className="vc-card overflow-hidden">
              <h2 className="border-b border-ink-100 px-5 py-4 font-display text-lg font-black">Day-by-day plan</h2>
              <ol className="divide-y divide-ink-100">
                {pkg.dayPlans.map((day) => (
                  <li key={day.id} className="flex gap-4 px-5 py-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl vc-lagoon font-display text-sm font-black text-white">
                      {day.dayNumber}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-ink-900">{day.title}</h3>
                      {day.description ? <p className="mt-0.5 text-sm text-ink-600">{day.description}</p> : null}
                      <div className="mt-1.5 flex flex-wrap gap-3 text-[11px] font-semibold text-ink-400">
                        {day.stay ? (
                          <span className="inline-flex items-center gap-1">
                            <BedDouble className="h-3.5 w-3.5" /> {day.stay}
                          </span>
                        ) : null}
                        {day.meals ? (
                          <span className="inline-flex items-center gap-1">
                            <Utensils className="h-3.5 w-3.5" /> {day.meals}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          <section className="grid gap-4 sm:grid-cols-2">
            <div className="vc-card p-5">
              <h2 className="mb-3 font-display text-base font-black text-emerald-700">What&apos;s included</h2>
              <ul className="space-y-2">
                {inclusions.length ? (
                  inclusions.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-ink-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> {item}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-ink-400">Ask the agency for details.</li>
                )}
              </ul>
            </div>
            <div className="vc-card p-5">
              <h2 className="mb-3 font-display text-base font-black text-rose-700">Not included</h2>
              <ul className="space-y-2">
                {exclusions.length ? (
                  exclusions.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-ink-700">
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" /> {item}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-ink-400">—</li>
                )}
              </ul>
            </div>
          </section>

          {pkg.reviews.length ? (
            <section className="vc-card p-5">
              <h2 className="mb-4 font-display text-lg font-black">Traveller reviews</h2>
              <ul className="space-y-4">
                {pkg.reviews.map((review) => (
                  <li key={review.id} className="flex gap-3">
                    <Avatar name={review.user.name} src={review.user.avatarUrl} size={40} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-ink-900">{review.user.name}</span>
                        <span className="flex text-amber-500">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-current" />
                          ))}
                        </span>
                        <span className="text-[11px] text-ink-400">{timeAgo(review.createdAt)}</span>
                      </div>
                      <p className="text-sm text-ink-700">{review.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        {/* sidebar */}
        <aside className="space-y-5">
          <PackageBookingBox
            pkg={{
              slug: pkg.slug,
              price: pkg.price,
              currency: pkg.currency,
              discountPercent: pkg.discountPercent,
              minGuests: pkg.minGuests,
              maxGuests: pkg.maxGuests,
              instantBook: pkg.instantBook,
              availableFrom: pkg.availableFrom ? pkg.availableFrom.toISOString().slice(0, 10) : null,
              availableTo: pkg.availableTo ? pkg.availableTo.toISOString().slice(0, 10) : null,
            }}
            signedIn={Boolean(viewer)}
          />

          <Link href={`/agencies/${pkg.agency.slug}`} className="vc-card block p-5 transition hover:shadow-lg">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-ink-100">
                {pkg.agency.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={pkg.agency.logoUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="grid h-full w-full place-items-center vc-lagoon font-display font-black text-white">
                    {pkg.agency.name.slice(0, 1)}
                  </span>
                )}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-1 truncate text-sm font-black text-ink-900">
                  {pkg.agency.name}
                  {pkg.agency.status === "VERIFIED" ? <VerifiedTick className="h-3.5 w-3.5" /> : null}
                </div>
                <div className="truncate text-xs text-ink-400">
                  {pkg.agency.city} · {pkg.agency._count.packages} packages · {pkg.agency._count.bookings} bookings
                </div>
              </div>
            </div>
            {pkg.agency.tagline ? <p className="mt-3 text-xs text-ink-600">{pkg.agency.tagline}</p> : null}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {parseList(pkg.agency.specialties)
                .slice(0, 3)
                .map((item) => (
                  <Badge key={item} tone="slate">
                    {item}
                  </Badge>
                ))}
            </div>
            <p className="mt-3 text-xs font-black text-lagoon-700">View full portfolio →</p>
          </Link>

          {pkg.availableFrom || pkg.availableTo ? (
            <div className="vc-card p-5 text-sm text-ink-600">
              <h3 className="mb-1 font-display text-base font-black text-ink-900">Departure window</h3>
              {pkg.availableFrom ? <p>From {formatDate(pkg.availableFrom)}</p> : null}
              {pkg.availableTo ? <p>Until {formatDate(pkg.availableTo)}</p> : null}
            </div>
          ) : null}
        </aside>
      </div>

      {similar.length ? (
        <section className="mt-8">
          <h2 className="mb-4 font-display text-xl font-black">Similar trips</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((item) => (
              <PackageCard key={item.id} pkg={item as unknown as PackageCardData} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
