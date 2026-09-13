import Link from "next/link";
import { CalendarDays, Mail, Phone, Users } from "lucide-react";
import { db } from "@/lib/db";
import { requireAgency } from "@/lib/auth";
import { BookingActions, StatusPill } from "@/components/BookingActions";
import { Chip, EmptyState } from "@/components/ui";
import { BOOKING_STATUSES } from "@/lib/constants";
import { formatDate, money } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Bookings" };

export default async function DashboardBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status = "" } = await searchParams;
  const { agency } = await requireAgency();

  const bookings = await db.booking.findMany({
    where: { agencyId: agency.id, ...(status ? { status } : {}) },
    orderBy: { createdAt: "desc" },
    include: {
      package: { select: { title: true, slug: true, destination: true } },
      user: { select: { name: true, username: true } },
      payment: { select: { status: true, method: true } },
    },
  });

  const totals = bookings.reduce(
    (acc, booking) => {
      if (["CONFIRMED", "COMPLETED"].includes(booking.status)) acc.revenue += booking.total;
      acc.guests += booking.guests;
      return acc;
    },
    { revenue: 0, guests: 0 },
  );

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 px-3 sm:px-4">
      <div>
        <h1 className="font-display text-3xl font-black tracking-tight">Bookings</h1>
        <p className="text-sm text-ink-500">
          {bookings.length} bookings · {totals.guests} travellers · {money(totals.revenue, "INR")} confirmed revenue
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href="/dashboard/bookings">
          <Chip active={!status}>All</Chip>
        </Link>
        {BOOKING_STATUSES.map((value) => (
          <Link key={value} href={`/dashboard/bookings?status=${value}`}>
            <Chip active={status === value}>{value.toLowerCase()}</Chip>
          </Link>
        ))}
      </div>

      {bookings.length ? (
        <ul className="space-y-3">
          {bookings.map((booking) => (
            <li key={booking.id} className="vc-card p-5">
              <div className="flex flex-wrap items-start gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/bookings/${booking.id}`} className="font-display text-base font-black text-ink-900 hover:text-brand-600">
                      {booking.package.title}
                    </Link>
                    <StatusPill status={booking.status} />
                    <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[11px] font-bold text-ink-600">
                      {booking.reference}
                    </span>
                  </div>
                  <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-ink-500">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5 text-brand-500" /> {formatDate(booking.travelDate)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-brand-500" /> {booking.guests} guest{booking.guests > 1 ? "s" : ""}
                    </span>
                    <span>booked {formatDate(booking.createdAt)}</span>
                    <span className="text-ink-400">
                      payment {booking.payment?.status.toLowerCase() ?? "unpaid"} ·{" "}
                      {booking.payment?.method.replace("MOCK_", "").toLowerCase()}
                    </span>
                  </p>
                  <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-600">
                    <span className="font-bold text-ink-800">{booking.travellerName}</span>
                    <a href={`mailto:${booking.travellerEmail}`} className="inline-flex items-center gap-1 hover:text-brand-600">
                      <Mail className="h-3.5 w-3.5" /> {booking.travellerEmail}
                    </a>
                    <a href={`tel:${booking.travellerPhone}`} className="inline-flex items-center gap-1 hover:text-brand-600">
                      <Phone className="h-3.5 w-3.5" /> {booking.travellerPhone}
                    </a>
                  </p>
                  {booking.notes ? (
                    <p className="mt-2 rounded-2xl bg-ink-50 px-3 py-2 text-xs text-ink-600">“{booking.notes}”</p>
                  ) : null}
                </div>
                <div className="text-right">
                  <div className="font-display text-xl font-black text-ink-900">{money(booking.total, booking.currency)}</div>
                  <div className="text-[11px] font-semibold text-ink-400">incl. taxes</div>
                </div>
              </div>
              <div className="mt-3 border-t border-ink-100 pt-3">
                <BookingActions bookingId={booking.id} status={booking.status as "PENDING"} role="agency" size="sm" />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState emoji="📭" title="No bookings here" body="When travellers book your packages they land in this list." />
      )}
    </div>
  );
}
