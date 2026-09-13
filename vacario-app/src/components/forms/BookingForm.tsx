"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarDays, CreditCard, Info, Lock, Smile, Users, Wallet } from "lucide-react";
import { Alert, Button, Field, inputClass } from "@/components/ui";
import { quoteFor } from "@/lib/pricing";
import { cn, money } from "@/lib/utils";

type PackageInfo = {
  id: string;
  slug: string;
  title: string;
  destination: string;
  durationDays: number;
  durationNights: number;
  price: number;
  currency: string;
  discountPercent: number;
  minGuests: number;
  maxGuests: number;
  instantBook: boolean;
  coverUrl: string | null;
  availableFrom: string | null;
  availableTo: string | null;
  agencyName: string;
};

const METHODS = [
  { key: "MOCK_CARD", label: "Card", icon: CreditCard, note: "Visa, Mastercard, Rupay" },
  { key: "MOCK_UPI", label: "UPI", icon: Smile, note: "GPay, PhonePe, Paytm" },
  { key: "PAY_AT_AGENCY", label: "Pay at agency", icon: Wallet, note: "Reserve now, pay later" },
] as const;

export function BookingForm({
  pkg,
  defaults,
}: {
  pkg: PackageInfo;
  defaults: { name: string; email: string; phone: string; date: string; guests: number };
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    travelDate: defaults.date,
    guests: Math.min(pkg.maxGuests, Math.max(pkg.minGuests, defaults.guests)),
    travellerName: defaults.name,
    travellerEmail: defaults.email,
    travellerPhone: defaults.phone,
    notes: "",
    paymentMethod: "MOCK_CARD" as (typeof METHODS)[number]["key"],
  });
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "", upi: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const quote = quoteFor(pkg, form.guests);
  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => setForm((f) => ({ ...f, [key]: value }));

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ packageId: pkg.id, ...form }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) return setError(data.error ?? "Could not complete this booking");
    router.push(data.next);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-5">
        {error ? <Alert>{error}</Alert> : null}

        <section className="vc-card p-5">
          <h2 className="mb-4 font-display text-lg font-black">Trip details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Travel date" required>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-500" />
                <input
                  type="date"
                  className={cn(inputClass, "pl-11")}
                  value={form.travelDate}
                  min={pkg.availableFrom ?? new Date().toISOString().slice(0, 10)}
                  max={pkg.availableTo ?? undefined}
                  onChange={(e) => set("travelDate", e.target.value)}
                  required
                />
              </div>
            </Field>
            <Field label={`Guests (${pkg.minGuests}–${pkg.maxGuests})`} required>
              <div className="relative">
                <Users className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-500" />
                <input
                  type="number"
                  className={cn(inputClass, "pl-11")}
                  min={pkg.minGuests}
                  max={pkg.maxGuests}
                  value={form.guests}
                  onChange={(e) => set("guests", Number(e.target.value))}
                  required
                />
              </div>
            </Field>
          </div>
        </section>

        <section className="vc-card p-5">
          <h2 className="mb-4 font-display text-lg font-black">Lead traveller</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" required>
              <input className={inputClass} value={form.travellerName} onChange={(e) => set("travellerName", e.target.value)} required />
            </Field>
            <Field label="Email" required>
              <input type="email" className={inputClass} value={form.travellerEmail} onChange={(e) => set("travellerEmail", e.target.value)} required />
            </Field>
            <Field label="Phone" required>
              <input className={inputClass} value={form.travellerPhone} onChange={(e) => set("travellerPhone", e.target.value)} placeholder="+91 98xxxxxx21" required />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Anything the agency should know?">
              <textarea
                className={cn(inputClass, "min-h-24 resize-y")}
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="Vegetarian meals, arriving a day early, need airport pickup…"
              />
            </Field>
          </div>
        </section>

        <section className="vc-card p-5">
          <h2 className="mb-1 font-display text-lg font-black">Payment</h2>
          <div className="mb-4 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Demo checkout — no card is charged and no card details are stored or sent anywhere. The booking, the
              payment record and the agency&apos;s dashboard entry are all real; only the gateway call is simulated.
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {METHODS.map(({ key, label, icon: Icon, note }) => (
              <button
                key={key}
                type="button"
                onClick={() => set("paymentMethod", key)}
                className={cn(
                  "rounded-2xl border-2 p-3 text-left transition",
                  form.paymentMethod === key ? "border-brand-400 bg-brand-50" : "border-ink-200 bg-white hover:border-brand-200",
                )}
              >
                <Icon className={cn("mb-1.5 h-5 w-5", form.paymentMethod === key ? "text-brand-500" : "text-ink-400")} />
                <div className="text-sm font-black text-ink-900">{label}</div>
                <div className="text-[11px] text-ink-500">{note}</div>
              </button>
            ))}
          </div>

          {form.paymentMethod === "MOCK_CARD" ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_120px_100px]">
              <Field label="Card number">
                <input className={inputClass} value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} placeholder="4242 4242 4242 4242" inputMode="numeric" autoComplete="off" />
              </Field>
              <Field label="Expiry">
                <input className={inputClass} value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} placeholder="04/29" autoComplete="off" />
              </Field>
              <Field label="CVV">
                <input className={inputClass} value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value })} placeholder="•••" autoComplete="off" />
              </Field>
            </div>
          ) : null}

          {form.paymentMethod === "MOCK_UPI" ? (
            <div className="mt-4">
              <Field label="UPI ID">
                <input className={inputClass} value={card.upi} onChange={(e) => setCard({ ...card, upi: e.target.value })} placeholder="yourname@upi" />
              </Field>
            </div>
          ) : null}

          {form.paymentMethod === "PAY_AT_AGENCY" ? (
            <p className="mt-4 rounded-2xl bg-ink-50 p-3 text-sm text-ink-600">
              Your booking will be held as <strong>pending</strong> until {pkg.agencyName} confirms and collects payment
              directly.
            </p>
          ) : null}
        </section>
      </div>

      {/* summary */}
      <aside className="space-y-4">
        <div className="vc-card sticky top-6 overflow-hidden">
          {pkg.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={pkg.coverUrl} alt="" className="h-32 w-full object-cover" />
          ) : (
            <div className="h-32 w-full vc-sunset" />
          )}
          <div className="space-y-3 p-5">
            <div>
              <h3 className="font-display text-base font-black leading-snug text-ink-900">{pkg.title}</h3>
              <p className="text-xs text-ink-500">
                {pkg.destination} · {pkg.durationDays}D/{pkg.durationNights}N · {pkg.agencyName}
              </p>
            </div>

            <dl className="space-y-1.5 border-t border-ink-100 pt-3 text-sm">
              <div className="flex justify-between text-ink-600">
                <dt>
                  {money(pkg.price, pkg.currency)} × {quote.guests}
                </dt>
                <dd>{money(quote.subtotal, pkg.currency)}</dd>
              </div>
              {quote.discount > 0 ? (
                <div className="flex justify-between font-semibold text-emerald-600">
                  <dt>Discount</dt>
                  <dd>−{money(quote.discount, pkg.currency)}</dd>
                </div>
              ) : null}
              <div className="flex justify-between text-ink-600">
                <dt>Taxes & fees</dt>
                <dd>{money(quote.taxes, pkg.currency)}</dd>
              </div>
              <div className="flex justify-between border-t border-ink-100 pt-2 font-display text-lg font-black text-ink-900">
                <dt>Total</dt>
                <dd>{money(quote.total, pkg.currency)}</dd>
              </div>
            </dl>

            <Button type="submit" full size="lg" disabled={busy}>
              <Lock className="h-4 w-4" />
              {busy
                ? "Confirming…"
                : form.paymentMethod === "PAY_AT_AGENCY"
                  ? "Reserve this trip"
                  : `Pay ${money(quote.total, pkg.currency)}`}
            </Button>
            <p className="text-center text-[11px] text-ink-400">
              {pkg.instantBook && form.paymentMethod !== "PAY_AT_AGENCY"
                ? "Instant confirmation — your booking is confirmed straight away."
                : "The agency confirms your booking, usually within a few hours."}
            </p>
          </div>
        </div>
      </aside>
    </form>
  );
}
