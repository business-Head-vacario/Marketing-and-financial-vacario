import Link from "next/link";
import { db } from "@/lib/db";
import { requireAgency } from "@/lib/auth";
import { PackageRowActions } from "@/components/PackageRowActions";
import { Badge, Button, EmptyState } from "@/components/ui";
import { money, parseList, priceAfterDiscount } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Manage packages" };

export default async function DashboardPackagesPage() {
  const { agency } = await requireAgency();

  const packages = await db.package.findMany({
    where: { agencyId: agency.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { bookings: true, reviews: true } } },
  });

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 px-3 sm:px-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-black tracking-tight">Packages</h1>
          <p className="text-sm text-ink-500">{packages.length} total · publish, edit or archive any of them.</p>
        </div>
        <Button href="/dashboard/packages/new">New package</Button>
      </div>

      {packages.length ? (
        <ul className="space-y-3">
          {packages.map((pkg) => {
            const cover = pkg.coverUrl ?? parseList(pkg.images)[0];
            return (
              <li key={pkg.id} className="vc-card flex flex-wrap items-center gap-4 p-4">
                {cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cover} alt="" className="h-20 w-28 shrink-0 rounded-2xl object-cover" />
                ) : (
                  <span className="h-20 w-28 shrink-0 rounded-2xl vc-sunset" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/packages/${pkg.slug}`} className="truncate font-display text-base font-black text-ink-900 hover:text-brand-600">
                      {pkg.title}
                    </Link>
                    <Badge tone={pkg.status === "PUBLISHED" ? "emerald" : pkg.status === "DRAFT" ? "amber" : "slate"}>
                      {pkg.status.toLowerCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-ink-500">
                    {pkg.destination} · {pkg.durationDays}D/{pkg.durationNights}N ·{" "}
                    {money(priceAfterDiscount(pkg.price, pkg.discountPercent), pkg.currency)} pp · {pkg._count.bookings} bookings ·{" "}
                    {pkg._count.reviews} reviews
                  </p>
                </div>
                <PackageRowActions id={pkg.id} slug={pkg.slug} status={pkg.status} />
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState
          emoji="🧳"
          title="No packages yet"
          body="Create your first package — title, price, day plan and photos."
          action={<Button href="/dashboard/packages/new">Create a package</Button>}
        />
      )}
    </div>
  );
}
