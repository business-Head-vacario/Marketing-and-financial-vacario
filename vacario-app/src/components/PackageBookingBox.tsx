"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarDays, ShieldCheck, Users, Zap } from "lucide-react";
import { quoteFor } from "@/lib/pricing";
import { money } from "@/lib/utils";
import { inputClass } from "@/components/ui";

export function PackageBookingBox({
  pkg,
  signedIn,
}: {
  pkg: {
    slug: string;
    price: number;
    currency: string;
    discountPercent: number;
    minGuests: number;
    maxGuests: number;
    instantBook: boolean;
    availableFrom: string | null;
    availableTo: string | null;
  };
  signedIn: boolean;
}) {
  const router = useRouter();
  const today = new Date();
  const defaultDate = new Date(today.getTime() + 14 * 86400000).toISOString().slice(0, 10);
  const [date, setDate] = useState(defaultDate);
  const [guests, setGuests] = useState(Math.max(1, pkg.minGuests));
  const quote = quoteFor(pkg, guests);

  return (
    <div className="vc-card sticky top-6 space-y-4 p-5">
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-black text-ink-900">{money(quote.unitPrice, pkg.currency)}</span>
            {pkg.discountPercent > 0 ? (
              <span className="text-sm font-semibold text-ink-400 line-through">{money(pkg.price, pkg.currency)}</span>
            ) : null}
          </div>
          <span className="text-xs font-semibold text-ink-400">per person</span>
        </div>
        {pkg.instantBook ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-black text-emerald-700">
            <Zap className="h-3 w-3" /> Instant book
          </span>
        ) : null}
      </div>

      <label className="block">
        <span className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-ink-500">
          <CalendarDays className="h-3.5 w-3.5" /> Travel date
        </span>
        <input
          type="date"
          className={inputClass}
          value={date}
          min={pkg.availableFrom ?? new Date().toISOString().slice(0, 10)}
          max={pkg.availableTo ?? undefined}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>

      <label className="block">
        <span className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-ink-500">
          <Users className="h-3.5 w-3.5" /> Guests ({pkg.minGuests}–{pkg.maxGuests})
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setGuests((g) => Math.max(pkg.minGuests, g - 1))}
            className="grid h-11 w-11 place-items-center rounded-2xl border border-ink-200 text-lg font-black text-ink-600"
          >
            −
          </button>
          <input
            type="number"
            className={inputClass}
            min={pkg.minGuests}
            max={pkg.maxGuests}
            value={guests}
            onChange={(e) => setGuests(Math.min(pkg.maxGuests, Math.max(pkg.minGuests, Number(e.target.value) || 1)))}
          />
          <button
            type="button"
            onClick={() => setGuests((g) => Math.min(pkg.maxGuests, g + 1))}
            className="grid h-11 w-11 place-items-center rounded-2xl border border-ink-200 text-lg font-black text-ink-600"
          >
            +
          </button>
        </div>
      </label>

      <dl className="space-y-1.5 rounded-2xl bg-ink-50 p-3 text-sm">
        <div className="flex justify-between text-ink-600">
          <dt>
            {money(pkg.price, pkg.currency)} × {quote.guests}
          </dt>
          <dd>{money(quote.subtotal, pkg.currency)}</dd>
        </div>
        {quote.discount > 0 ? (
          <div className="flex justify-between font-semibold text-emerald-600">
            <dt>Discount {pkg.discountPercent}%</dt>
            <dd>−{money(quote.discount, pkg.currency)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between text-ink-600">
          <dt>Taxes & fees ({Math.round(quote.taxRate * 100)}%)</dt>
          <dd>{money(quote.taxes, pkg.currency)}</dd>
        </div>
        <div className="flex justify-between border-t border-ink-200 pt-1.5 font-display text-base font-black text-ink-900">
          <dt>Total</dt>
          <dd>{money(quote.total, pkg.currency)}</dd>
        </div>
      </dl>

      <button
        onClick={() =>
          router.push(
            signedIn
              ? `/packages/${pkg.slug}/book?date=${date}&guests=${guests}`
              : `/login?next=${encodeURIComponent(`/packages/${pkg.slug}/book?date=${date}&guests=${guests}`)}`,
          )
        }
        className="w-full rounded-full vc-sunset px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-brand-500/25 transition hover:brightness-105"
      >
        {signedIn ? "Continue to book" : "Log in to book"}
      </button>

      <p className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-ink-400">
        <ShieldCheck className="h-3.5 w-3.5 text-lagoon-500" /> Free cancellation until the agency confirms
      </p>
    </div>
  );
}
