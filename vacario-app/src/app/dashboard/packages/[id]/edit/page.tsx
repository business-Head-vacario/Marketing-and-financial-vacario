import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireAgency } from "@/lib/auth";
import { PackageForm } from "@/components/forms/PackageForm";
import { parseList } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit package" };

export default async function EditPackagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { agency } = await requireAgency();

  const pkg = await db.package.findUnique({
    where: { id },
    include: { dayPlans: { orderBy: { dayNumber: "asc" } } },
  });
  if (!pkg || pkg.agencyId !== agency.id) notFound();

  return (
    <div className="mx-auto w-full max-w-4xl px-3 sm:px-4">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-black tracking-tight">Edit package</h1>
        <p className="text-sm text-ink-500">{pkg.title}</p>
      </div>
      <PackageForm
        packageId={pkg.id}
        initial={{
          title: pkg.title,
          destination: pkg.destination,
          country: pkg.country,
          startCity: pkg.startCity ?? "",
          summary: pkg.summary,
          description: pkg.description,
          category: pkg.category,
          durationDays: pkg.durationDays,
          durationNights: pkg.durationNights,
          price: pkg.price,
          currency: pkg.currency,
          discountPercent: pkg.discountPercent,
          minGuests: pkg.minGuests,
          maxGuests: pkg.maxGuests,
          inclusions: parseList(pkg.inclusions),
          exclusions: parseList(pkg.exclusions),
          highlights: parseList(pkg.highlights),
          images: parseList(pkg.images),
          availableFrom: pkg.availableFrom ? pkg.availableFrom.toISOString().slice(0, 10) : "",
          availableTo: pkg.availableTo ? pkg.availableTo.toISOString().slice(0, 10) : "",
          instantBook: pkg.instantBook,
          status: pkg.status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
          dayPlans: pkg.dayPlans.map((day) => ({
            title: day.title,
            description: day.description,
            meals: day.meals,
            stay: day.stay,
          })),
        }}
      />
    </div>
  );
}
