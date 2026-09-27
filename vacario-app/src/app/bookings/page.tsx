import Link from "next/link";
import { CalendarDays, MapPin, Ticket, Users } from "lucide-react";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { StatusPill } from "@/components/BookingActions";
import { Button, EmptyState } from "@/components/ui";
import { formatDate, money, parseList } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "My bookings" };

export default async function BookingsPage() {
  const user = await requireUser("/login?next=/bookings");

  const bookings = await db.booking.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      package: { select: { title: true, slug: true, destination: true, coverUrl: true, images: true, durationDays: true, durationNights: true } },
      agency: { select: { name: true, slug: true, phone: true, email: true } },
      payment: { select: { status: true, method: true } },
    },
  });

  const upcoming = bookings.filter((b) => ["PENDING", "CONFIRMED"].includes(b.status));
  const past = bookings.filter((b) => !["PENDING", "CONFIRMED"].includes(b.status));

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-3 sm:px-4">
      <div>
        <h1 className="font-display text-3xl font-black tracking-tight">My bookings</h1>
        <p className="text-sm text-ink-500">Every trip you&apos;ve booked through Vacario, with its live status.</p>
      </div>

      {!bookings.length ? (
        <EmptyState
          emoji="🧳"
          title="No bookings yet"
          body="Find a package from a verified agency and book it in a couple of taps."
          action={<Button href="/packages">Browse packages</Button>}
        />
      ) : null}

      {[
        ["Upcoming", upcoming],
        ["Past & cancelled", past],
      ].map(([label, list]) =>
        (list as typeof bookings).length ? (
          <section key={label as string}>
            <h2 className="mb-3 font-display text-lg font-black">{label as string}</h2>
            <ul className="space-y-3">
              {(list as typeof bookings).map((booking) => {
                const cover = booking.package.coverUrl ?? parseList(booking.package.images)[0];
                return (
                  <li key={booking.id}>
                    <Link href={`/bookings/${booking.id}`} className="vc-card flex flex-wrap items-center gap-4 p-4 transition hover:shadow-lg">
                      {cover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={cover} alt="" className="h-20 w-28 shrink-0 rounded-2xl object-cover" />
                      ) : (
                        <span className="grid h-20 w-28 shrink-0 place-items-center rounded-2xl vc-sunset text-white">
                          <Ticket className="h-6 w-6" />
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate font-display text-base font-black text-ink-900">{booking.package.title}</h3>
                          <StatusPill status={booking.status} />
                        </div>
                        <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-ink-500">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-brand-500" /> {booking.package.destination}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <CalendarDays className="h-3.5 w-3.5 text-brand-500" /> {formatDate(booking.travelDate)}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Users className="h-3.5 w-3.5 text-brand-500" /> {booking.guests} guest{booking.guests > 1 ? "s" : ""}
                          </span>
                        </p>
                        <p className="mt-1 text-xs text-ink-400">
                          Ref {booking.reference} · {booking.agency.name} · payment {booking.payment?.status.toLowerCase() ?? "unpaid"}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-lg font-black text-ink-900">{money(booking.total, booking.currency)}</div>
                        <div className="text-[11px] font-semibold text-ink-400">total paid</div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null,
      )}
    </div>
  );
}
