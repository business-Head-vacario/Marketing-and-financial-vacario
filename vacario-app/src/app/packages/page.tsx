import Link from "next/link";
import { Search, SlidersHorizontal, Ticket } from "lucide-react";
import { db } from "@/lib/db";
import { PackageCard, type PackageCardData } from "@/components/cards";
import { Chip, EmptyState, Button } from "@/components/ui";
import { PACKAGE_CATEGORIES } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tour packages" };

const SORTS = [
  { key: "popular", label: "Most booked" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
  { key: "duration", label: "Longest trip" },
  { key: "new", label: "Newest" },
];

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; max?: string; sort?: string; days?: string }>;
}) {
  const { q = "", category = "", max = "", sort = "popular", days = "" } = await searchParams;
  const term = q.trim();

  const where: Record<string, unknown> = { status: "PUBLISHED" };
  if (category) where.category = category;
  if (max) where.price = { lte: Number(max) };
  if (days === "short") where.durationDays = { lte: 4 };
  if (days === "week") where.durationDays = { gte: 5, lte: 9 };
  if (days === "long") where.durationDays = { gte: 10 };
  if (term) {
    where.OR = [
      { title: { contains: term } },
      { destination: { contains: term } },
      { country: { contains: term } },
      { summary: { contains: term } },
      { agency: { name: { contains: term } } },
    ];
  }

  const orderBy =
    sort === "price-asc"
      ? { price: "asc" as const }
      : sort === "price-desc"
        ? { price: "desc" as const }
        : sort === "duration"
          ? { durationDays: "desc" as const }
          : sort === "new"
            ? { createdAt: "desc" as const }
            : { bookings: { _count: "desc" as const } };

  const [packages, destinations] = await Promise.all([
    db.package.findMany({
      where,
      orderBy,
      take: 24,
      include: {
        agency: { select: { name: true, slug: true, status: true, city: true } },
        reviews: { select: { rating: true } },
      },
    }),
    db.package.groupBy({
      by: ["destination"],
      where: { status: "PUBLISHED" },
      _count: { destination: true },
      orderBy: { _count: { destination: "desc" } },
      take: 10,
    }),
  ]);

  const link = (patch: Record<string, string>) => {
    const params = new URLSearchParams();
    Object.entries({ q: term, category, max, sort, days, ...patch }).forEach(([key, value]) => value && params.set(key, value));
    const qs = params.toString();
    return qs ? `/packages?${qs}` : "/packages";
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-3 sm:px-4">
      <section className="overflow-hidden rounded-[2rem] vc-lagoon px-6 py-9 text-white">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-black uppercase tracking-[0.2em]">
          <Ticket className="h-3.5 w-3.5" /> Marketplace
        </span>
        <h1 className="mt-3 font-display text-4xl font-black">Book a trip, not a phone call</h1>
        <p className="mt-2 max-w-xl text-sm text-white/90">
          Packages from travel agencies on Vacario — full day plans, what&apos;s included, and instant confirmation on
          eligible trips.
        </p>
        <form action="/packages" className="mt-5 flex max-w-xl flex-wrap gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              name="q"
              defaultValue={term}
              placeholder="Kerala, Bali honeymoon, trek…"
              className="w-full rounded-full border-0 bg-white/95 py-3 pl-11 pr-4 text-sm text-ink-900 outline-none placeholder:text-ink-300"
            />
          </div>
          <button className="rounded-full bg-ink-900 px-6 text-sm font-bold">Search</button>
        </form>
      </section>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wide text-ink-400">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
          </span>
          <Link href={link({ category: "", max: "", days: "" })}>
            <Chip active={!category && !max && !days}>All</Chip>
          </Link>
          {PACKAGE_CATEGORIES.map((item) => (
            <Link key={item} href={link({ category: category === item ? "" : item })}>
              <Chip active={category === item}>{item.charAt(0) + item.slice(1).toLowerCase()}</Chip>
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {[
            ["short", "Up to 4 days"],
            ["week", "5–9 days"],
            ["long", "10+ days"],
          ].map(([key, label]) => (
            <Link key={key} href={link({ days: days === key ? "" : key })}>
              <Chip active={days === key}>{label}</Chip>
            </Link>
          ))}
          {[
            ["15000", "Under ₹15k"],
            ["30000", "Under ₹30k"],
            ["60000", "Under ₹60k"],
          ].map(([key, label]) => (
            <Link key={key} href={link({ max: max === key ? "" : key })}>
              <Chip active={max === key}>{label}</Chip>
            </Link>
          ))}
          <div className="ml-auto flex flex-wrap gap-2">
            {SORTS.map((option) => (
              <Link key={option.key} href={link({ sort: option.key })}>
                <Chip active={sort === option.key}>{option.label}</Chip>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {destinations.length ? (
        <div className="flex flex-wrap gap-2">
          {destinations.map((destination) => (
            <Link key={destination.destination} href={link({ q: destination.destination })}>
              <Chip active={term === destination.destination}>
                📍 {destination.destination} <span className="text-ink-400">{destination._count.destination}</span>
              </Chip>
            </Link>
          ))}
        </div>
      ) : null}

      {packages.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => {
            const ratings = pkg.reviews.map((review) => review.rating);
            const rating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null;
            return (
              <PackageCard
                key={pkg.id}
                pkg={{ ...(pkg as unknown as PackageCardData), rating, reviewCount: ratings.length }}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState
          emoji="🧳"
          title="No packages match those filters"
          body="Try a wider budget or a different category."
          action={<Button href="/packages">Clear filters</Button>}
        />
      )}

      <div className="vc-card flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <h2 className="font-display text-lg font-black">Run a travel agency?</h2>
          <p className="text-sm text-ink-500">List your packages and take bookings directly from the feed.</p>
        </div>
        <Button href="/onboarding/agent" variant="lagoon">
          List your agency
        </Button>
      </div>
    </div>
  );
}
