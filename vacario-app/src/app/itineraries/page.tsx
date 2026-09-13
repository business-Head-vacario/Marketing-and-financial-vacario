import Link from "next/link";
import { Route, Search } from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ItineraryCard } from "@/components/cards";
import { Button, Chip, EmptyState } from "@/components/ui";
import { TRAVEL_STYLES } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const metadata = { title: "Itineraries" };

export default async function ItinerariesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; style?: string; days?: string }>;
}) {
  const { q = "", style = "", days = "" } = await searchParams;
  const viewer = await getCurrentUser();
  const term = q.trim();

  const where: Record<string, unknown> = { isPublic: true };
  if (style) where.style = style;
  if (days === "short") where.days = { lte: 3 };
  if (days === "week") where.days = { gte: 4, lte: 8 };
  if (days === "long") where.days = { gte: 9 };
  if (term) {
    where.OR = [
      { title: { contains: term } },
      { destination: { contains: term } },
      { country: { contains: term } },
      { summary: { contains: term } },
      { tags: { contains: term } },
    ];
  }

  const itineraries = await db.itinerary.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 30,
    include: {
      author: { select: { name: true, username: true, avatarUrl: true } },
      _count: { select: { dayPlans: true } },
    },
  });

  const link = (patch: Record<string, string>) => {
    const params = new URLSearchParams();
    Object.entries({ q: term, style, days, ...patch }).forEach(([key, value]) => value && params.set(key, value));
    const qs = params.toString();
    return qs ? `/itineraries?${qs}` : "/itineraries";
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-3 sm:px-4">
      <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 px-6 py-9 text-white">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-black uppercase tracking-[0.2em]">
          <Route className="h-3.5 w-3.5" /> Real plans, real costs
        </span>
        <h1 className="mt-3 font-display text-4xl font-black">Itineraries you can actually copy</h1>
        <p className="mt-2 max-w-xl text-sm text-white/90">
          Every plan lists days, stops, timings and what each thing cost. Copy one into your account and make it yours.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <form action="/itineraries" className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              name="q"
              defaultValue={term}
              placeholder="Ladakh, Bali, Rajasthan…"
              className="w-64 rounded-full border-0 bg-white/95 py-3 pl-11 pr-4 text-sm text-ink-900 outline-none placeholder:text-ink-300"
            />
          </form>
          <Button href="/itineraries/new" size="lg" variant="secondary" className="bg-ink-900">
            Build yours
          </Button>
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        <Link href={link({ style: "", days: "" })}>
          <Chip active={!style && !days}>All plans</Chip>
        </Link>
        {[
          ["short", "1–3 days"],
          ["week", "4–8 days"],
          ["long", "9+ days"],
        ].map(([key, label]) => (
          <Link key={key} href={link({ days: days === key ? "" : key })}>
            <Chip active={days === key}>{label}</Chip>
          </Link>
        ))}
        {TRAVEL_STYLES.map((item) => (
          <Link key={item} href={link({ style: style === item ? "" : item })}>
            <Chip active={style === item}>{item}</Chip>
          </Link>
        ))}
      </div>

      {itineraries.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {itineraries.map((itinerary) => (
            <ItineraryCard key={itinerary.id} itinerary={{ ...itinerary, stopCount: undefined }} />
          ))}
        </div>
      ) : (
        <EmptyState
          emoji="🗺️"
          title="No itineraries match that"
          body="Try another destination or clear the filters."
          action={<Button href="/itineraries/new">{viewer ? "Publish the first one" : "Join and publish one"}</Button>}
        />
      )}
    </div>
  );
}
