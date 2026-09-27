import Link from "next/link";
import { Building, ShieldCheck, Ticket, Users } from "lucide-react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { AdminAgencyActions } from "@/components/AdminAgencyActions";
import { Badge, EmptyState } from "@/components/ui";
import { formatDate, money, parseList } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin" };

export default async function AdminPage() {
  await requireAdmin();

  const [agencies, stats, revenueRows] = await Promise.all([
    db.agency.findMany({
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      include: {
        owner: { select: { name: true, username: true, email: true } },
        _count: { select: { packages: true, bookings: true } },
      },
    }),
    Promise.all([db.user.count(), db.post.count(), db.package.count(), db.booking.count()]),
    db.booking.findMany({ where: { status: { in: ["CONFIRMED", "COMPLETED"] } }, select: { total: true } }),
  ]);

  const [users, posts, packages, bookings] = stats;
  const gmv = revenueRows.reduce((sum, booking) => sum + booking.total, 0);
  const pending = agencies.filter((agency) => agency.status === "PENDING");

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-3 sm:px-4">
      <div>
        <h1 className="font-display text-3xl font-black tracking-tight">
          Admin <span className="vc-gradient-text">console</span>
        </h1>
        <p className="text-sm text-ink-500">Verify agencies and keep an eye on the marketplace.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Users", value: users, icon: Users },
          { label: "Posts", value: posts, icon: Building },
          { label: "Packages", value: packages, icon: Ticket },
          { label: "Bookings", value: bookings, icon: Ticket },
          { label: "GMV", value: money(gmv, "INR"), icon: ShieldCheck },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="vc-card p-4">
            <Icon className="mb-2 h-4 w-4 text-brand-500" />
            <div className="font-display text-xl font-black text-ink-900">{value}</div>
            <div className="text-[11px] font-bold uppercase tracking-wide text-ink-400">{label}</div>
          </div>
        ))}
      </div>

      <section>
        <h2 className="mb-3 font-display text-lg font-black">
          Agency verification {pending.length ? <Badge tone="amber">{pending.length} pending</Badge> : null}
        </h2>
        {agencies.length ? (
          <ul className="space-y-3">
            {agencies.map((agency) => (
              <li key={agency.id} className="vc-card p-5">
                <div className="flex flex-wrap items-start gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-ink-100">
                    {agency.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={agency.logoUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <Building className="h-5 w-5 text-ink-400" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={`/agencies/${agency.slug}`} className="font-display text-base font-black text-ink-900 hover:text-brand-600">
                        {agency.name}
                      </Link>
                      <Badge tone={agency.status === "VERIFIED" ? "emerald" : agency.status === "PENDING" ? "amber" : "rose"}>
                        {agency.status.toLowerCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-ink-500">
                      {agency.city}, {agency.country} · licence {agency.licenseNo || "—"} · GST {agency.gstNo || "—"} ·{" "}
                      {agency.yearsInBusiness} yrs · joined {formatDate(agency.createdAt)}
                    </p>
                    <p className="text-xs text-ink-400">
                      {agency.owner.name} (@{agency.owner.username}) · {agency.email} · {agency.phone} ·{" "}
                      {agency._count.packages} packages · {agency._count.bookings} bookings
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {parseList(agency.specialties).slice(0, 4).map((item) => (
                        <Badge key={item} tone="slate">
                          {item}
                        </Badge>
                      ))}
                    </div>
                    {agency.reviewNote ? (
                      <p className="mt-2 rounded-xl bg-ink-50 px-3 py-2 text-xs text-ink-600">Note: {agency.reviewNote}</p>
                    ) : null}
                  </div>
                </div>
                <div className="mt-3 border-t border-ink-100 pt-3">
                  <AdminAgencyActions agencyId={agency.id} status={agency.status} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState emoji="🏢" title="No agencies yet" body="Agency signups will appear here for verification." />
        )}
      </section>
    </div>
  );
}
