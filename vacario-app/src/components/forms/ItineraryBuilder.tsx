"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Camera, ChevronDown, ChevronUp, Plus, Route, Trash, Wallet } from "lucide-react";
import { Alert, Button, Chip, Field, inputClass } from "@/components/ui";
import { STOP_CATEGORIES, STOP_META, TRAVEL_STYLES, type StopCategory } from "@/lib/constants";
import { cn, money } from "@/lib/utils";

type Stop = { time: string; title: string; place: string; note: string; cost: string; category: StopCategory };
type Day = { title: string; notes: string; stops: Stop[]; open: boolean };

const emptyStop = (): Stop => ({ time: "", title: "", place: "", note: "", cost: "", category: "ACTIVITY" });
const emptyDay = (index: number): Day => ({ title: `Day ${index + 1}`, notes: "", stops: [emptyStop()], open: true });

export function ItineraryBuilder() {
  const router = useRouter();
  const [meta, setMeta] = useState({
    title: "",
    destination: "",
    country: "India",
    summary: "",
    style: "",
    bestSeason: "",
    budget: "",
    currency: "INR",
    coverUrl: "",
    isPublic: true,
    shareToFeed: true,
  });
  const [tagDraft, setTagDraft] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [days, setDays] = useState<Day[]>([emptyDay(0)]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stopsTotal = useMemo(
    () => days.reduce((sum, day) => sum + day.stops.reduce((s, stop) => s + (Number(stop.cost) || 0), 0), 0),
    [days],
  );
  const stopCount = days.reduce((sum, day) => sum + day.stops.filter((s) => s.title.trim()).length, 0);

  const setDay = (index: number, patch: Partial<Day>) =>
    setDays((list) => list.map((day, i) => (i === index ? { ...day, ...patch } : day)));

  const setStop = (dayIndex: number, stopIndex: number, patch: Partial<Stop>) =>
    setDays((list) =>
      list.map((day, i) =>
        i === dayIndex
          ? { ...day, stops: day.stops.map((stop, j) => (j === stopIndex ? { ...stop, ...patch } : stop)) }
          : day,
      ),
    );

  async function uploadCover(file: File) {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body });
    const data = await res.json();
    if (res.ok) setMeta((m) => ({ ...m, coverUrl: data.url }));
    else setError(data.error ?? "Upload failed");
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    const cleaned = days.map((day) => ({
      title: day.title,
      notes: day.notes,
      stops: day.stops
        .filter((stop) => stop.title.trim())
        .map((stop) => ({
          time: stop.time,
          title: stop.title,
          place: stop.place,
          note: stop.note,
          cost: stop.cost ? Number(stop.cost) : undefined,
          category: stop.category,
        })),
    }));
    if (!cleaned.some((day) => day.stops.length)) return setError("Add at least one stop to your plan");

    setBusy(true);
    const res = await fetch("/api/itineraries", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...meta,
        budget: meta.budget ? Number(meta.budget) : stopsTotal || undefined,
        tags,
        dayPlans: cleaned,
      }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) return setError(data.error ?? "Could not save your itinerary");
    router.push(data.next);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {error ? <Alert>{error}</Alert> : null}

      <div className="vc-card overflow-hidden">
        <div className="relative h-36 w-full bg-cover bg-center vc-sunset" style={meta.coverUrl ? { backgroundImage: `url(${meta.coverUrl})` } : undefined}>
          <label className="absolute right-3 top-3 flex cursor-pointer items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-ink-700 shadow">
            <Camera className="h-3.5 w-3.5" /> Cover photo
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && void uploadCover(e.target.files[0])} />
          </label>
        </div>
        <div className="space-y-4 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Trip title" required>
              <input className={inputClass} value={meta.title} onChange={(e) => setMeta({ ...meta, title: e.target.value })} placeholder="7 days in Ladakh on a budget" required />
            </Field>
            <Field label="Destination" required>
              <input className={inputClass} value={meta.destination} onChange={(e) => setMeta({ ...meta, destination: e.target.value })} placeholder="Leh–Ladakh" required />
            </Field>
            <Field label="Country">
              <input className={inputClass} value={meta.country} onChange={(e) => setMeta({ ...meta, country: e.target.value })} />
            </Field>
            <Field label="Best season">
              <input className={inputClass} value={meta.bestSeason} onChange={(e) => setMeta({ ...meta, bestSeason: e.target.value })} placeholder="June – September" />
            </Field>
          </div>
          <Field label="Summary" hint="The one-paragraph version other travellers read first">
            <textarea className={cn(inputClass, "min-h-24 resize-y")} value={meta.summary} onChange={(e) => setMeta({ ...meta, summary: e.target.value })} placeholder="Shared taxis, homestays and two high passes — done in a week without flying business class." />
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Total budget" hint={stopsTotal ? `Stops add up to ${money(stopsTotal, meta.currency)}` : "Leave blank to use stop costs"}>
              <div className="relative">
                <Wallet className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />
                <input className={cn(inputClass, "pl-11")} type="number" min={0} value={meta.budget} onChange={(e) => setMeta({ ...meta, budget: e.target.value })} placeholder={String(stopsTotal || 25000)} />
              </div>
            </Field>
            <Field label="Currency">
              <select className={inputClass} value={meta.currency} onChange={(e) => setMeta({ ...meta, currency: e.target.value })}>
                {["INR", "USD", "EUR", "GBP", "AED"].map((currency) => (
                  <option key={currency}>{currency}</option>
                ))}
              </select>
            </Field>
            <Field label="Tags" hint="Enter to add">
              <input
                className={inputClass}
                value={tagDraft}
                onChange={(e) => setTagDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  e.preventDefault();
                  const value = tagDraft.trim().replace(/^#/, "");
                  if (value && !tags.includes(value)) setTags([...tags, value]);
                  setTagDraft("");
                }}
                placeholder="budget"
              />
            </Field>
          </div>

          {tags.length ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button key={tag} type="button" onClick={() => setTags(tags.filter((t) => t !== tag))}>
                  <Chip active>#{tag} ✕</Chip>
                </button>
              ))}
            </div>
          ) : null}

          <div>
            <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-ink-500">Trip style</span>
            <div className="flex flex-wrap gap-2">
              {TRAVEL_STYLES.map((style) => (
                <button key={style} type="button" onClick={() => setMeta({ ...meta, style: meta.style === style ? "" : style })}>
                  <Chip active={meta.style === style}>{style}</Chip>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* days */}
      <div className="space-y-4">
        {days.map((day, dayIndex) => {
          const dayTotal = day.stops.reduce((sum, stop) => sum + (Number(stop.cost) || 0), 0);
          return (
            <div key={dayIndex} className="vc-card overflow-hidden">
              <div className="flex items-center gap-3 border-b border-ink-100 bg-ink-50/60 px-4 py-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl vc-sunset text-sm font-black text-white">
                  {dayIndex + 1}
                </span>
                <input
                  className="min-w-0 flex-1 bg-transparent text-sm font-black text-ink-900 outline-none"
                  value={day.title}
                  onChange={(e) => setDay(dayIndex, { title: e.target.value })}
                  placeholder={`Day ${dayIndex + 1} — arrival & acclimatising`}
                />
                {dayTotal > 0 ? (
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                    {money(dayTotal, meta.currency)}
                  </span>
                ) : null}
                <button type="button" onClick={() => setDay(dayIndex, { open: !day.open })} className="rounded-lg p-1.5 text-ink-500" aria-label="Toggle day">
                  {day.open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {days.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => setDays(days.filter((_, i) => i !== dayIndex))}
                    className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50"
                    aria-label="Remove day"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                ) : null}
              </div>

              {day.open ? (
                <div className="space-y-3 p-4">
                  {day.stops.map((stop, stopIndex) => (
                    <div key={stopIndex} className="rounded-2xl border border-ink-100 p-3">
                      <div className="grid gap-2 sm:grid-cols-[90px_1fr_140px]">
                        <input className={cn(inputClass, "py-2")} value={stop.time} onChange={(e) => setStop(dayIndex, stopIndex, { time: e.target.value })} placeholder="09:00" />
                        <input className={cn(inputClass, "py-2")} value={stop.title} onChange={(e) => setStop(dayIndex, stopIndex, { title: e.target.value })} placeholder="Shanti Stupa at sunrise" />
                        <select
                          className={cn(inputClass, "py-2")}
                          value={stop.category}
                          onChange={(e) => setStop(dayIndex, stopIndex, { category: e.target.value as StopCategory })}
                        >
                          {STOP_CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                              {STOP_META[category].emoji} {STOP_META[category].label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_140px_40px]">
                        <input className={cn(inputClass, "py-2")} value={stop.place} onChange={(e) => setStop(dayIndex, stopIndex, { place: e.target.value })} placeholder="Place / address" />
                        <input className={cn(inputClass, "py-2")} type="number" min={0} value={stop.cost} onChange={(e) => setStop(dayIndex, stopIndex, { cost: e.target.value })} placeholder="Cost" />
                        <button
                          type="button"
                          onClick={() =>
                            setDay(dayIndex, { stops: day.stops.filter((_, j) => j !== stopIndex) })
                          }
                          className="grid place-items-center rounded-2xl border border-ink-200 text-rose-500 hover:bg-rose-50"
                          aria-label="Remove stop"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                      <input
                        className={cn(inputClass, "mt-2 py-2")}
                        value={stop.note}
                        onChange={(e) => setStop(dayIndex, stopIndex, { note: e.target.value })}
                        placeholder="Tip for whoever copies this plan…"
                      />
                    </div>
                  ))}
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setDay(dayIndex, { stops: [...day.stops, emptyStop()] })}
                      className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3.5 py-2 text-xs font-bold text-ink-700 hover:border-brand-300 hover:text-brand-600"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add stop
                    </button>
                    <input
                      className={cn(inputClass, "flex-1 py-2")}
                      value={day.notes}
                      onChange={(e) => setDay(dayIndex, { notes: e.target.value })}
                      placeholder="Notes for the day (transport, altitude, bookings…)"
                    />
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}

        <button
          type="button"
          onClick={() => setDays([...days, emptyDay(days.length)])}
          className="flex w-full items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-ink-200 bg-white py-4 text-sm font-bold text-ink-500 transition hover:border-brand-300 hover:text-brand-600"
        >
          <Plus className="h-4 w-4" /> Add day {days.length + 1}
        </button>
      </div>

      <div className="vc-card flex flex-wrap items-center gap-4 p-5">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-ink-700">
            <input type="checkbox" checked={meta.isPublic} onChange={(e) => setMeta({ ...meta, isPublic: e.target.checked })} className="h-4 w-4 accent-orange-500" />
            Public plan
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-ink-700">
            <input type="checkbox" checked={meta.shareToFeed} onChange={(e) => setMeta({ ...meta, shareToFeed: e.target.checked })} className="h-4 w-4 accent-orange-500" />
            Share to my feed
          </label>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="text-right">
            <div className="font-display text-lg font-black text-ink-900">
              {days.length} days · {stopCount} stops
            </div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">
              {money(Number(meta.budget) || stopsTotal, meta.currency)} planned
            </div>
          </div>
          <Button type="submit" size="lg" disabled={busy}>
            <Route className="h-4 w-4" /> {busy ? "Publishing…" : "Publish itinerary"}
          </Button>
        </div>
      </div>
    </form>
  );
}
