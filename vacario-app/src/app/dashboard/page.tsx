import Link from "next/link";
import { ArrowRight, CalendarDays, Package, ShieldCheck, TrendingUp, Users, Wallet } from "lucide-react";
import { db } from "@/lib/db";
import { requireAgency } from "@/lib/auth";
import { StatusPill } from "@/components/BookingActions";
import { Badge, Button, EmptyState } from "@/components/ui";
import { formatDate, money } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Agent dashboard" };

export default async function DashboardPage() {
  const { agency } = await requireAgency();

  const [full, bookings, packages, revenueRows] = await Promise.all([
    db.agency.findUnique({ where: { id: agency.id }, include: { _count: { select: { packages: true, bookings: true, reviews: true } } } }),
    db.booking.findMany({
      where: { agencyId: agency.id },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { package: { select: { title: true } }, user: { select: { name: true, username: true } } },
    }),
    db.package.findMany({
      where: { agencyId: agency.id },
      orderBy: { createdAt: "desc" },
      take: 4,
      include: { _count: { select: { bookings: true } } },
    }),
    db.booking.findMany({
      where: { agencyId: agency.id, status: { in: ["CONFIRMED", "COMPLETED"] } },
      select: { total: true, currency: true, guests: true },
    }),
  ]);

  const revenue = revenueRows.reduce((sum, booking) => sum + booking.total, 0);
  const travellers = revenueRows.reduce((sum, booking) => sum + booking.guests, 0);
  const pending = bookings.filter((booking) => booking.status === "PENDING").length;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-3 sm:px-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-black tracking-tight">
            {agency.name} <span className="vc-gradient-text">dashboard</span>
          </h1>
          <p className="text-sm text-ink-500">Packages, bookings and your public portfolio — all from here.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button href="/dashboard/packages/new">New package</Button>
          <Button href={`/agencies/${agency.slug}`} variant="outline">
            View portfolio
          </Button>
        </div>
      </div>

      {agency.status !== "VERIFIED" ? (
        <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-amber-200 bg-amber-50 p-5">
          <ShieldCheck className="h-6 w-6 shrink-0 text-amber-600" />
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-base font-black text-amber-900">
              {agency.status === "PENDING" ? "Verification in progress" : "Verification was declined"}
            </h2>
            <p className="text-sm text-amber-800">
              {agency.status === "PENDING"
                ? "You can publish packages and take bookings now. The verified tick appears once our team checks your licence."
                : "Update your licence details and we'll take another look."}
            </p>
          </div>
          <Button href="/dashboard/profile" variant="outline" size="sm">
            Update details
          </Button>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Revenue booked", value: money(revenue, "INR"), icon: Wallet, tint: "from-emerald-400 to-teal-500" },
          { label: "Bookings", value: full?._count.bookings ?? 0, icon: CalendarDays, tint: "from-brand-400 to-rose-500" },
          { label: "Travellers", value: travellers, icon: Users, tint: "from-violet-400 to-indigo-500" },
          { label: "Live packages", value: full?._count.packages ?? 0, icon: Package, tint: "from-amber-400 to-orange-500" },
        ].map(({ label, value, icon: Icon, tint }) => (
          <div key={label} className="vc-card overflow-hidden p-5">
            <span className={`mb-3 grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br ${tint} text-white`}>
              <Icon className="h-5 w-5" />
            </span>
            <div className="font-display text-2xl font-black text-ink-900">{value}</div>
            <div className="text-[11px] font-bold uppercase tracking-wide text-ink-400">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="vc-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
            <h2 className="font-display text-lg font-black">
              Recent bookings {pending ? <Badge tone="amber">{pending} awaiting you</Badge> : null}
            </h2>
            <Link href="/dashboard/bookings" className="text-xs font-black text-brand-600 hover:underline">
              See all
            </Link>
          </div>
          {bookings.length ? (
            <ul className="divide-y divide-ink-100">
              {bookings.map((booking) => (
                <li key={booking.id}>
                  <Link href={`/bookings/${booking.id}`} className="flex flex-wrap items-center gap-3 px-5 py-3 transition hover:bg-ink-50/60">
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-bold text-ink-900">{booking.package.title}</div>
                      <div className="text-xs text-ink-400">
                        {booking.reference} · {booking.travellerName} · {formatDate(booking.travelDate)} · {booking.guests} guest
                        {booking.guests > 1 ? "s" : ""}
                      </div>
                    </div>
                    <StatusPill status={booking.status} />
                    <span className="font-display text-base font-black text-ink-900">{money(booking.total, booking.currency)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-5">
              <EmptyState emoji="📭" title="No bookings yet" body="Publish a package and share it to your feed to get your first booking." />
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <div className="vc-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
              <h2 className="font-display text-base font-black">Your packages</h2>
              <Link href="/dashboard/packages" className="text-xs font-black text-brand-600 hover:underline">
                Manage
              </Link>
            </div>
            <ul className="divide-y divide-ink-100">
              {packages.map((pkg) => (
                <li key={pkg.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold text-ink-900">{pkg.title}</div>
                    <div className="text-[11px] text-ink-400">
                      {money(pkg.price, pkg.currency)} · {pkg._count.bookings} bookings
                    </div>
                  </div>
                  <Badge tone={pkg.status === "PUBLISHED" ? "emerald" : "slate"}>{pkg.status.toLowerCase()}</Badge>
                </li>
              ))}
              {!packages.length ? <li className="px-5 py-4 text-sm text-ink-400">Nothing published yet.</li> : null}
            </ul>
          </div>

          <div className="overflow-hidden rounded-3xl vc-sunset p-5 text-white">
            <TrendingUp className="mb-2 h-6 w-6" />
            <h3 className="font-display text-lg font-black">Promote inside the feed</h3>
            <p className="mt-1 text-xs text-white/85">
              Post a reel or a 360° shot from a past trip and attach a package — it gets a Book button right in the feed.
            </p>
            <Link href="/create" className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-black text-brand-600">
              Create a post <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <Link href="/dashboard/profile" className="vc-card block p-5 transition hover:shadow-lg">
            <h3 className="font-display text-base font-black">Agency profile</h3>
            <p className="text-xs text-ink-500">Logo, cover, specialities, licence details and contact info.</p>
            <p className="mt-2 text-xs font-black text-brand-600">Edit profile →</p>
          </Link>
        </aside>
      </div>
    </div>
  );
}
