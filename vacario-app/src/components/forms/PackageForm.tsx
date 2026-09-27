"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, Trash } from "lucide-react";
import { Alert, Button, Field, inputClass } from "@/components/ui";
import { MediaUploader } from "./MediaUploader";
import type { MediaItem } from "@/components/media/MediaView";
import { PACKAGE_CATEGORIES } from "@/lib/constants";
import { cn, money, priceAfterDiscount } from "@/lib/utils";

export type PackageFormValues = {
  title: string;
  destination: string;
  country: string;
  startCity: string;
  summary: string;
  description: string;
  category: string;
  durationDays: number;
  durationNights: number;
  price: number;
  currency: string;
  discountPercent: number;
  minGuests: number;
  maxGuests: number;
  inclusions: string[];
  exclusions: string[];
  highlights: string[];
  images: string[];
  availableFrom: string;
  availableTo: string;
  instantBook: boolean;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  dayPlans: { title: string; description: string; meals: string; stay: string }[];
};

function ListEditor({
  label,
  hint,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  hint?: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const value = draft.trim();
    if (!value) return;
    onChange([...items, value]);
    setDraft("");
  };
  return (
    <div>
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-500">{label}</span>
      <div className="flex gap-2">
        <input
          className={inputClass}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
        />
        <button type="button" onClick={add} className="rounded-2xl border border-ink-200 bg-white px-4 text-sm font-bold text-ink-700 hover:border-brand-300">
          Add
        </button>
      </div>
      {hint ? <span className="mt-1 block text-xs text-ink-400">{hint}</span> : null}
      {items.length ? (
        <ul className="mt-2 space-y-1.5">
          {items.map((item, index) => (
            <li key={`${item}-${index}`} className="flex items-center gap-2 rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-700">
              <span className="min-w-0 flex-1 truncate">{item}</span>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, i) => i !== index))}
                className="text-rose-500"
                aria-label={`Remove ${item}`}
              >
                <Trash className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function PackageForm({
  initial,
  packageId,
}: {
  initial: PackageFormValues;
  packageId?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [media, setMedia] = useState<MediaItem[]>(initial.images.map((url) => ({ url, kind: "IMAGE" })));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof PackageFormValues>(key: K, value: PackageFormValues[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const setDay = (index: number, patch: Partial<PackageFormValues["dayPlans"][number]>) =>
    set("dayPlans", form.dayPlans.map((day, i) => (i === index ? { ...day, ...patch } : day)));

  async function submit(event: React.FormEvent, status?: PackageFormValues["status"]) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    const payload = { ...form, status: status ?? form.status, images: media.map((item) => item.url) };
    const res = await fetch(packageId ? `/api/packages/${packageId}` : "/api/packages", {
      method: packageId ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) return setError(data.error ?? "Could not save this package");
    router.push(data.next ?? "/dashboard/packages");
    router.refresh();
  }

  return (
    <form onSubmit={(e) => submit(e)} className="space-y-6">
      {error ? <Alert>{error}</Alert> : null}

      <section className="vc-card space-y-4 p-5">
        <h2 className="font-display text-lg font-black">The basics</h2>
        <Field label="Package title" required>
          <input className={inputClass} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Spiti Valley circuit — 7 days from Manali" required />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Destination" required>
            <input className={inputClass} value={form.destination} onChange={(e) => set("destination", e.target.value)} placeholder="Spiti Valley" required />
          </Field>
          <Field label="Country">
            <input className={inputClass} value={form.country} onChange={(e) => set("country", e.target.value)} />
          </Field>
          <Field label="Starts from">
            <input className={inputClass} value={form.startCity} onChange={(e) => set("startCity", e.target.value)} placeholder="Manali" />
          </Field>
        </div>
        <Field label="One-line summary" hint="Shown on cards and search results">
          <input className={inputClass} value={form.summary} onChange={(e) => set("summary", e.target.value)} maxLength={300} placeholder="High-altitude villages, monasteries and two 4,000 m passes in a week." />
        </Field>
        <Field label="Full description">
          <textarea className={cn(inputClass, "min-h-32 resize-y")} value={form.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-4">
          <Field label="Category">
            <select className={inputClass} value={form.category} onChange={(e) => set("category", e.target.value)}>
              {PACKAGE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0) + category.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Days" required>
            <input className={inputClass} type="number" min={1} value={form.durationDays} onChange={(e) => set("durationDays", Number(e.target.value))} required />
          </Field>
          <Field label="Nights">
            <input className={inputClass} type="number" min={0} value={form.durationNights} onChange={(e) => set("durationNights", Number(e.target.value))} />
          </Field>
          <Field label="Instant book">
            <select
              className={inputClass}
              value={form.instantBook ? "yes" : "no"}
              onChange={(e) => set("instantBook", e.target.value === "yes")}
            >
              <option value="yes">Confirm automatically on payment</option>
              <option value="no">I confirm each booking</option>
            </select>
          </Field>
        </div>
      </section>

      <section className="vc-card space-y-4 p-5">
        <h2 className="font-display text-lg font-black">Pricing & group size</h2>
        <div className="grid gap-4 sm:grid-cols-4">
          <Field label="Price per person" required>
            <input className={inputClass} type="number" min={0} value={form.price} onChange={(e) => set("price", Number(e.target.value))} required />
          </Field>
          <Field label="Currency">
            <select className={inputClass} value={form.currency} onChange={(e) => set("currency", e.target.value)}>
              {["INR", "USD", "EUR", "GBP", "AED"].map((currency) => (
                <option key={currency}>{currency}</option>
              ))}
            </select>
          </Field>
          <Field label="Discount %">
            <input className={inputClass} type="number" min={0} max={90} value={form.discountPercent} onChange={(e) => set("discountPercent", Number(e.target.value))} />
          </Field>
          <Field label="Guests (min–max)">
            <div className="flex gap-2">
              <input className={inputClass} type="number" min={1} value={form.minGuests} onChange={(e) => set("minGuests", Number(e.target.value))} />
              <input className={inputClass} type="number" min={1} value={form.maxGuests} onChange={(e) => set("maxGuests", Number(e.target.value))} />
            </div>
          </Field>
        </div>
        <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          Travellers see{" "}
          <span className="font-black">{money(priceAfterDiscount(form.price, form.discountPercent), form.currency)}</span>{" "}
          per person{form.discountPercent > 0 ? ` (was ${money(form.price, form.currency)})` : ""} plus 5% tax at checkout.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Available from">
            <input className={inputClass} type="date" value={form.availableFrom} onChange={(e) => set("availableFrom", e.target.value)} />
          </Field>
          <Field label="Available until">
            <input className={inputClass} type="date" value={form.availableTo} onChange={(e) => set("availableTo", e.target.value)} />
          </Field>
        </div>
      </section>

      <section className="vc-card space-y-4 p-5">
        <h2 className="font-display text-lg font-black">Photos</h2>
        <MediaUploader items={media} onChange={setMedia} allowPanorama={false} max={12} label="Package gallery — first image is the cover" />
      </section>

      <section className="vc-card grid gap-5 p-5 sm:grid-cols-2">
        <ListEditor label="Highlights" items={form.highlights} onChange={(v) => set("highlights", v)} placeholder="Sunrise at Key Monastery" />
        <ListEditor label="What's included" items={form.inclusions} onChange={(v) => set("inclusions", v)} placeholder="6 nights stay + breakfast" />
        <ListEditor label="Not included" items={form.exclusions} onChange={(v) => set("exclusions", v)} placeholder="Flights to Delhi" />
      </section>

      <section className="vc-card space-y-4 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-black">Day-by-day plan</h2>
          <button
            type="button"
            onClick={() => set("dayPlans", [...form.dayPlans, { title: `Day ${form.dayPlans.length + 1}`, description: "", meals: "", stay: "" }])}
            className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3.5 py-2 text-xs font-bold text-ink-700 hover:border-brand-300 hover:text-brand-600"
          >
            <Plus className="h-3.5 w-3.5" /> Add day
          </button>
        </div>
        {form.dayPlans.map((day, index) => (
          <div key={index} className="rounded-2xl border border-ink-100 p-4">
            <div className="mb-2 flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center rounded-xl vc-lagoon text-xs font-black text-white">{index + 1}</span>
              <input className={cn(inputClass, "py-2")} value={day.title} onChange={(e) => setDay(index, { title: e.target.value })} placeholder="Manali → Kaza via Kunzum La" />
              <button
                type="button"
                onClick={() => set("dayPlans", form.dayPlans.filter((_, i) => i !== index))}
                className="shrink-0 rounded-lg p-2 text-rose-500 hover:bg-rose-50"
                aria-label="Remove day"
              >
                <Trash className="h-4 w-4" />
              </button>
            </div>
            <textarea className={cn(inputClass, "min-h-20 resize-y")} value={day.description} onChange={(e) => setDay(index, { description: e.target.value })} placeholder="What happens on this day…" />
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <input className={cn(inputClass, "py-2")} value={day.stay} onChange={(e) => setDay(index, { stay: e.target.value })} placeholder="Stay: homestay in Kaza" />
              <input className={cn(inputClass, "py-2")} value={day.meals} onChange={(e) => setDay(index, { meals: e.target.value })} placeholder="Meals: breakfast, dinner" />
            </div>
          </div>
        ))}
        {!form.dayPlans.length ? <p className="text-sm text-ink-400">No days added yet — travellers love a clear plan.</p> : null}
      </section>

      <div className="vc-card flex flex-wrap items-center gap-3 p-5">
        <Button type="submit" size="lg" disabled={busy}>
          {busy ? "Saving…" : packageId ? "Save changes" : "Publish package"}
        </Button>
        <button
          type="button"
          disabled={busy}
          onClick={(e) => submit(e as unknown as React.FormEvent, "DRAFT")}
          className="rounded-full border border-ink-200 bg-white px-6 py-3.5 text-base font-bold text-ink-700 hover:border-brand-300 disabled:opacity-50"
        >
          Save as draft
        </button>
        <p className="text-xs text-ink-400">Drafts stay hidden from the marketplace until you publish them.</p>
      </div>
    </form>
  );
}
