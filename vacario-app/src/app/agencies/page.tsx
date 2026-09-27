import Link from "next/link";
import { Building, Search, ShieldCheck } from "lucide-react";
import { db } from "@/lib/db";
import { AgencyCard } from "@/components/cards";
import { Button, Chip, EmptyState } from "@/components/ui";
import { AGENCY_SPECIALTIES } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const metadata = { title: "Travel agencies" };

export default async function AgenciesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; specialty?: string; verified?: string }>;
}) {
  const { q = "", specialty = "", verified = "" } = await searchParams;
  const term = q.trim();

  const where: Record<string, unknown> = {};
  if (verified === "1") where.status = "VERIFIED";
  if (specialty) where.specialties = { contains: specialty };
  if (term) {
    where.OR = [
      { name: { contains: term } },
      { city: { contains: term } },
      { tagline: { contains: term } },
      { about: { contains: term } },
      { specialties: { contains: term } },
    ];
  }

  const agencies = await db.agency.findMany({
    where,
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    take: 24,
    include: {
      _count: { select: { packages: true } },
      reviews: { select: { rating: true } },
    },
  });

  const link = (patch: Record<string, string>) => {
    const params = new URLSearchParams();
    Object.entries({ q: term, specialty, verified, ...patch }).forEach(([key, value]) => value && params.set(key, value));
    const qs = params.toString();
    return qs ? `/agencies?${qs}` : "/agencies";
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-3 sm:px-4">
      <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet-500 via-fuchsia-500 to-rose-500 px-6 py-9 text-white">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-black uppercase tracking-[0.2em]">
          <Building className="h-3.5 w-3.5" /> Agency directory
        </span>
        <h1 className="mt-3 font-display text-4xl font-black">The people who make the trip happen</h1>
        <p className="mt-2 max-w-xl text-sm text-white/90">
          Browse agency portfolios — their trips, their photos, their reviews — then book straight from the page.
        </p>
        <form action="/agencies" className="mt-5 flex max-w-lg gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              name="q"
              defaultValue={term}
              placeholder="Agency name, city or speciality"
              className="w-full rounded-full border-0 bg-white/95 py-3 pl-11 pr-4 text-sm text-ink-900 outline-none placeholder:text-ink-300"
            />
          </div>
          <button className="rounded-full bg-ink-900 px-6 text-sm font-bold">Search</button>
        </form>
      </section>

      <div className="flex flex-wrap gap-2">
        <Link href={link({ verified: verified === "1" ? "" : "1" })}>
          <Chip active={verified === "1"}>
            <ShieldCheck className="h-3.5 w-3.5" /> Verified only
          </Chip>
        </Link>
        {AGENCY_SPECIALTIES.map((item) => (
          <Link key={item} href={link({ specialty: specialty === item ? "" : item })}>
            <Chip active={specialty === item}>{item}</Chip>
          </Link>
        ))}
      </div>

      {agencies.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agencies.map((agency) => {
            const ratings = agency.reviews.map((review) => review.rating);
            return (
              <AgencyCard
                key={agency.id}
                agency={{
                  slug: agency.slug,
                  name: agency.name,
                  tagline: agency.tagline,
                  city: agency.city,
                  country: agency.country,
                  logoUrl: agency.logoUrl,
                  coverUrl: agency.coverUrl,
                  status: agency.status,
                  specialties: agency.specialties,
                  packageCount: agency._count.packages,
                  rating: ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null,
                  reviewCount: ratings.length,
                }}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState emoji="🏢" title="No agencies match that" body="Try a different city or speciality." />
      )}

      <div className="vc-card flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <h2 className="font-display text-lg font-black">Your agency isn&apos;t here yet?</h2>
          <p className="text-sm text-ink-500">Create a portfolio, publish packages and take bookings — free to start.</p>
        </div>
        <Button href="/onboarding/agent" variant="lagoon">
          Join as an agency
        </Button>
      </div>
    </div>
  );
}
