import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { BookingForm } from "@/components/forms/BookingForm";
import { parseList } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Complete your booking" };

export default async function BookPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ date?: string; guests?: string }>;
}) {
  const { slug } = await params;
  const { date, guests } = await searchParams;
  const user = await requireUser(`/login?next=/packages/${slug}/book`);

  const pkg = await db.package.findUnique({
    where: { slug },
    include: { agency: { select: { name: true } } },
  });
  if (!pkg) notFound();
  if (pkg.status !== "PUBLISHED") redirect(`/packages/${slug}`);

  const fallbackDate = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);

  return (
    <div className="mx-auto w-full max-w-5xl px-3 sm:px-4">
      <Link href={`/packages/${slug}`} className="mb-3 inline-flex items-center gap-1 text-sm font-bold text-ink-500 hover:text-brand-600">
        <ChevronLeft className="h-4 w-4" /> Back to package
      </Link>
      <h1 className="mb-5 font-display text-3xl font-black tracking-tight">Complete your booking</h1>

      <BookingForm
        pkg={{
          id: pkg.id,
          slug: pkg.slug,
          title: pkg.title,
          destination: pkg.destination,
          durationDays: pkg.durationDays,
          durationNights: pkg.durationNights,
          price: pkg.price,
          currency: pkg.currency,
          discountPercent: pkg.discountPercent,
          minGuests: pkg.minGuests,
          maxGuests: pkg.maxGuests,
          instantBook: pkg.instantBook,
          coverUrl: pkg.coverUrl ?? parseList(pkg.images)[0] ?? null,
          availableFrom: pkg.availableFrom ? pkg.availableFrom.toISOString().slice(0, 10) : null,
          availableTo: pkg.availableTo ? pkg.availableTo.toISOString().slice(0, 10) : null,
          agencyName: pkg.agency.name,
        }}
        defaults={{
          name: user.name,
          email: user.email,
          phone: "",
          date: date || fallbackDate,
          guests: Number(guests) || pkg.minGuests,
        }}
      />
    </div>
  );
}
