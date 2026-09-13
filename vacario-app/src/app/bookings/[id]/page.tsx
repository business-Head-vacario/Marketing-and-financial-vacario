import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, CheckCircle, Mail, MapPin, Phone, Ticket, Users } from "lucide-react";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { BookingActions, StatusPill } from "@/components/BookingActions";
import { Button, VerifiedTick } from "@/components/ui";
import { formatDate, money, parseList } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Booking details" };

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser(`/login?next=/bookings/${id}`);

  const booking = await db.booking.findUnique({
    where: { id },
    include: {
      package: { select: { title: true, slug: true, destination: true, country: true, durationDays: true, durationNights: true, coverUrl: true, images: true } },
      agency: { select: { name: true, slug: true, status: true, phone: true, email: true, city: true, ownerId: true } },
      payment: true,
      user: { select: { id: true, name: true } },
    },
  });
  if (!booking) notFound();

  const isTraveller = booking.userId === user.id;
  const isAgent = booking.agency.ownerId === user.id;
  if (!isTraveller && !isAgent && user.role !== "ADMIN") notFound();

  const cover = booking.package.coverUrl ?? parseList(booking.package.images)[0];

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5 px-3 sm:px-4">
      <div className="vc-card overflow-hidden">
        <div className="flex items-center gap-3 border-b border-ink-100 bg-gradient-to-r from-emerald-50 to-white px-5 py-4">
          <CheckCircle className="h-8 w-8 text-emerald-500" />
          <div>
            <h1 className="font-display text-xl font-black text-ink-900">
              {booking.status === "CONFIRMED"
                ? "Your trip is confirmed"
                : booking.status === "PENDING"
                  ? "Booking received"
                  : booking.status === "COMPLETED"
                    ? "Trip completed"
                    : "Booking cancelled"}
            </h1>
            <p className="text-sm text-ink-500">
              Reference <span className="font-black text-ink-800">{booking.reference}</span> · booked {formatDate(booking.createdAt)}
            </p>
          </div>
          <div className="ml-auto">
            <StatusPill status={booking.status} />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 p-5">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt="" className="h-28 w-40 rounded-2xl object-cover" />
          ) : (
            <span className="grid h-28 w-40 place-items-center rounded-2xl vc-sunset text-white">
              <Ticket className="h-7 w-7" />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <Link href={`/packages/${booking.package.slug}`} className="font-display text-lg font-black text-ink-900 hover:text-brand-600">
              {booking.package.title}
            </Link>
            <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold text-ink-500">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4 text-brand-500" /> {booking.package.destination}, {booking.package.country}
              </span>
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-4 w-4 text-brand-500" /> {formatDate(booking.travelDate)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Users className="h-4 w-4 text-brand-500" /> {booking.guests} guest{booking.guests > 1 ? "s" : ""}
              </span>
            </p>
            <p className="mt-1 text-xs text-ink-400">
              {booking.package.durationDays} days / {booking.package.durationNights} nights
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <section className="vc-card p-5">
          <h2 className="mb-3 font-display text-base font-black">Price breakdown</h2>
          <dl className="space-y-1.5 text-sm">
            <div className="flex justify-between text-ink-600">
              <dt>Subtotal</dt>
              <dd>{money(booking.subtotal, booking.currency)}</dd>
            </div>
            {booking.discount > 0 ? (
              <div className="flex justify-between font-semibold text-emerald-600">
                <dt>Discount</dt>
                <dd>−{money(booking.discount, booking.currency)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between text-ink-600">
              <dt>Taxes & fees</dt>
              <dd>{money(booking.taxes, booking.currency)}</dd>
            </div>
            <div className="flex justify-between border-t border-ink-100 pt-2 font-display text-lg font-black text-ink-900">
              <dt>Total</dt>
              <dd>{money(booking.total, booking.currency)}</dd>
            </div>
          </dl>
          {booking.payment ? (
            <p className="mt-3 rounded-2xl bg-ink-50 p-3 text-xs text-ink-500">
              {booking.payment.method.replace("MOCK_", "").replace("_", " ").toLowerCase()} ·{" "}
              <span className="font-black text-ink-700">{booking.payment.status.toLowerCase()}</span> · ref{" "}
              {booking.payment.reference}
              <br />
              <span className="text-ink-400">Simulated gateway — no real charge was made.</span>
            </p>
          ) : null}
        </section>

        <section className="vc-card p-5">
          <h2 className="mb-3 font-display text-base font-black">Your agency</h2>
          <Link href={`/agencies/${booking.agency.slug}`} className="flex items-center gap-1 font-black text-ink-900 hover:text-brand-600">
            {booking.agency.name}
            {booking.agency.status === "VERIFIED" ? <VerifiedTick className="h-4 w-4" /> : null}
          </Link>
          <p className="text-xs text-ink-400">{booking.agency.city}</p>
          <div className="mt-3 space-y-1.5 text-sm">
            <a href={`tel:${booking.agency.phone}`} className="flex items-center gap-2 text-ink-600 hover:text-brand-600">
              <Phone className="h-4 w-4 text-brand-500" /> {booking.agency.phone}
            </a>
            <a href={`mailto:${booking.agency.email}`} className="flex items-center gap-2 text-ink-600 hover:text-brand-600">
              <Mail className="h-4 w-4 text-brand-500" /> {booking.agency.email}
            </a>
          </div>

          <h3 className="mt-4 text-xs font-black uppercase tracking-wide text-ink-400">Lead traveller</h3>
          <p className="text-sm text-ink-700">
            {booking.travellerName}
            <br />
            {booking.travellerEmail} · {booking.travellerPhone}
          </p>
          {booking.notes ? <p className="mt-2 rounded-2xl bg-ink-50 p-3 text-xs text-ink-600">“{booking.notes}”</p> : null}
        </section>
      </div>

      <div className="vc-card flex flex-wrap items-center justify-between gap-3 p-5">
        <BookingActions bookingId={booking.id} status={booking.status as "PENDING"} role={isAgent ? "agency" : "traveller"} />
        <div className="flex gap-2">
          <Button href={`/packages/${booking.package.slug}`} variant="outline" size="sm">
            View package
          </Button>
          <Button href={isAgent ? "/dashboard/bookings" : "/bookings"} variant="ghost" size="sm">
            All bookings
          </Button>
        </div>
      </div>
    </div>
  );
}
