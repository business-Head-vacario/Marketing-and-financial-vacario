import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Sun, Wallet } from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ForkButton } from "@/components/ForkButton";
import { Avatar, Badge, Button, VerifiedTick } from "@/components/ui";
import { STOP_META, type StopCategory } from "@/lib/constants";
import { formatDate, money, parseList } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const itinerary = await db.itinerary.findUnique({ where: { id }, select: { title: true, summary: true } });
  return itinerary ? { title: itinerary.title, description: itinerary.summary } : { title: "Itinerary not found" };
}

export default async function ItineraryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const viewer = await getCurrentUser();

  const itinerary = await db.itinerary.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
          bio: true,
          agency: { select: { status: true, name: true, slug: true } },
        },
      },
      dayPlans: { orderBy: { dayNumber: "asc" }, include: { stops: { orderBy: { order: "asc" } } } },
    },
  });
  if (!itinerary) notFound();
  if (!itinerary.isPublic && itinerary.author.id !== viewer?.id) notFound();

  const stops = itinerary.dayPlans.flatMap((day) => day.stops);
  const stopsTotal = stops.reduce((sum, stop) => sum + (stop.cost ?? 0), 0);
  const tags = parseList(itinerary.tags);

  const related = await db.package.findMany({
    where: { status: "PUBLISHED", destination: { contains: itinerary.destination.split(/[\s–-]/)[0] } },
    take: 2,
    include: { agency: { select: { name: true, slug: true, status: true } } },
  });

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-3 sm:px-4">
      <div className="vc-card overflow-hidden">
        <div
          className="relative h-52 w-full bg-cover bg-center vc-sunset sm:h-72"
          style={itinerary.coverUrl ? { backgroundImage: `url(${itinerary.coverUrl})` } : undefined}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <div className="flex flex-wrap gap-2">
              <Badge tone="amber" className="bg-amber-400 text-white">
                {itinerary.days}-day itinerary
              </Badge>
              {itinerary.style ? <Badge className="bg-white/20 text-white">{itinerary.style}</Badge> : null}
              {!itinerary.isPublic ? <Badge className="bg-ink-900 text-white">Private</Badge> : null}
            </div>
            <h1 className="mt-2 font-display text-3xl font-black leading-tight sm:text-4xl">{itinerary.title}</h1>
            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/90">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {itinerary.destination}
                {itinerary.country ? `, ${itinerary.country}` : ""}
              </span>
              {itinerary.bestSeason ? (
                <span className="inline-flex items-center gap-1">
                  <Sun className="h-4 w-4" /> {itinerary.bestSeason}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-4 w-4" /> {formatDate(itinerary.createdAt)}
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 p-5">
          <Link href={`/u/${itinerary.author.username}`} className="flex items-center gap-3">
            <Avatar name={itinerary.author.name} src={itinerary.author.avatarUrl} size={46} ring />
            <span>
              <span className="flex items-center gap-1 text-sm font-black text-ink-900">
                {itinerary.author.name}
                {itinerary.author.agency?.status === "VERIFIED" ? <VerifiedTick className="h-3.5 w-3.5" /> : null}
              </span>
              <span className="block text-xs text-ink-400">@{itinerary.author.username}</span>
            </span>
          </Link>

          <div className="ml-auto flex flex-wrap items-center gap-3">
            <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-right">
              <div className="font-display text-lg font-black text-emerald-700">
                {money(itinerary.budget ?? stopsTotal, itinerary.currency)}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wide text-emerald-600">total budget</div>
            </div>
            <ForkButton itineraryId={itinerary.id} signedIn={Boolean(viewer)} />
          </div>
        </div>

        {itinerary.summary ? (
          <p className="whitespace-pre-line border-t border-ink-100 px-5 py-4 text-sm leading-relaxed text-ink-700">
            {itinerary.summary}
          </p>
        ) : null}

        {tags.length ? (
          <div className="flex flex-wrap gap-1.5 border-t border-ink-100 px-5 py-3">
            {tags.map((tag) => (
              <Link key={tag} href={`/explore?tag=${encodeURIComponent(tag)}`} className="text-xs font-bold text-brand-600 hover:underline">
                #{tag}
              </Link>
            ))}
          </div>
        ) : null}
      </div>

      {/* timeline */}
      <div className="space-y-4">
        {itinerary.dayPlans.map((day) => {
          const dayTotal = day.stops.reduce((sum, stop) => sum + (stop.cost ?? 0), 0);
          return (
            <section key={day.id} className="vc-card overflow-hidden">
              <header className="flex flex-wrap items-center gap-3 border-b border-ink-100 bg-gradient-to-r from-brand-50 to-white px-5 py-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl vc-sunset font-display text-sm font-black text-white">
                  {day.dayNumber}
                </span>
                <h2 className="font-display text-lg font-black text-ink-900">{day.title || `Day ${day.dayNumber}`}</h2>
                {dayTotal > 0 ? (
                  <span className="ml-auto rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
                    {money(dayTotal, itinerary.currency)}
                  </span>
                ) : null}
              </header>

              <ol className="relative space-y-4 px-5 py-4">
                {day.stops.map((stop, index) => {
                  const meta = STOP_META[(stop.category as StopCategory) ?? "ACTIVITY"] ?? STOP_META.ACTIVITY;
                  return (
                    <li key={stop.id} className="relative flex gap-4 pl-1">
                      <div className="flex flex-col items-center">
                        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm ${meta.tint}`}>
                          {meta.emoji}
                        </span>
                        {index < day.stops.length - 1 ? <span className="mt-1 w-px flex-1 bg-ink-200" /> : null}
                      </div>
                      <div className="min-w-0 flex-1 pb-1">
                        <div className="flex flex-wrap items-baseline gap-2">
                          {stop.time ? <span className="text-xs font-black text-brand-600">{stop.time}</span> : null}
                          <h3 className="text-sm font-bold text-ink-900">{stop.title}</h3>
                          <Badge tone="slate">{meta.label}</Badge>
                          {stop.cost ? (
                            <span className="ml-auto inline-flex items-center gap-1 text-xs font-black text-emerald-700">
                              <Wallet className="h-3.5 w-3.5" /> {money(stop.cost, itinerary.currency)}
                            </span>
                          ) : null}
                        </div>
                        {stop.place ? <p className="text-xs font-semibold text-ink-500">📍 {stop.place}</p> : null}
                        {stop.note ? <p className="mt-0.5 text-sm text-ink-600">{stop.note}</p> : null}
                      </div>
                    </li>
                  );
                })}
                {!day.stops.length ? <li className="text-sm text-ink-400">A free day.</li> : null}
              </ol>

              {day.notes ? (
                <p className="border-t border-ink-100 bg-ink-50/50 px-5 py-3 text-xs text-ink-600">💡 {day.notes}</p>
              ) : null}
            </section>
          );
        })}
      </div>

      {related.length ? (
        <section className="vc-card p-5">
          <h2 className="mb-1 font-display text-lg font-black">Rather have someone else organise it?</h2>
          <p className="mb-4 text-sm text-ink-500">Agency packages covering {itinerary.destination}.</p>
          <div className="space-y-3">
            {related.map((pkg) => (
              <Link key={pkg.id} href={`/packages/${pkg.slug}`} className="flex items-center gap-3 rounded-2xl border border-ink-100 p-3 transition hover:border-lagoon-300 hover:bg-lagoon-50/40">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-ink-900">{pkg.title}</div>
                  <div className="truncate text-xs text-ink-500">
                    {pkg.durationDays}D/{pkg.durationNights}N · {pkg.agency.name}
                  </div>
                </div>
                <span className="font-display text-base font-black text-lagoon-700">{money(pkg.price, pkg.currency)}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <div className="flex justify-center pb-4">
        <Button href="/itineraries" variant="outline">
          Browse more itineraries
        </Button>
      </div>
    </div>
  );
}
