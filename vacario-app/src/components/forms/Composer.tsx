"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Camera, Clapperboard, MapPin, Route, Rotate3d, Star, Wallet } from "lucide-react";
import { Alert, Button, Chip, Field, inputClass } from "@/components/ui";
import { MediaUploader } from "./MediaUploader";
import type { MediaItem } from "@/components/media/MediaView";
import { cn } from "@/lib/utils";

const TYPES = [
  { key: "PHOTO", label: "Photo", icon: Camera, hint: "One shot or a carousel of up to 10." },
  { key: "REEL", label: "Reel", icon: Clapperboard, hint: "A vertical clip — MP4 or WEBM works best." },
  { key: "THREESIXTY", label: "360°", icon: Rotate3d, hint: "An equirectangular (2:1) panorama people can drag." },
] as const;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function Composer({
  itineraries,
  packages,
}: {
  itineraries: { id: string; title: string }[];
  packages: { id: string; title: string }[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const initialType = params.get("type");

  const [type, setType] = useState<(typeof TYPES)[number]["key"]>(
    initialType === "REEL" || initialType === "THREESIXTY" ? initialType : "PHOTO",
  );
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [caption, setCaption] = useState("");
  const [locationName, setLocationName] = useState("");
  const [country, setCountry] = useState("");
  const [tagDraft, setTagDraft] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [tripMonth, setTripMonth] = useState("");
  const [rating, setRating] = useState(0);
  const [itineraryId, setItineraryId] = useState("");
  const [packageId, setPackageId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addTag() {
    const value = tagDraft.trim().replace(/^#/, "");
    if (!value || tags.includes(value)) return setTagDraft("");
    setTags([...tags, value].slice(0, 15));
    setTagDraft("");
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (!media.length) return setError("Add at least one photo, video or 360° image");
    if (type === "THREESIXTY" && !media.some((m) => m.kind === "PANORAMA")) {
      return setError("Mark at least one file as a 360° panorama below the thumbnail");
    }
    setBusy(true);
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        type,
        caption,
        locationName,
        country,
        tags,
        budget: budget ? Number(budget) : undefined,
        tripMonth,
        rating: rating || undefined,
        itineraryId,
        packageId,
        media,
      }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) return setError(data.error ?? "Could not publish your post");
    router.push(`/p/${data.post.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {error ? <Alert>{error}</Alert> : null}

      <div className="grid gap-3 sm:grid-cols-3">
        {TYPES.map(({ key, label, icon: Icon, hint }) => (
          <button
            key={key}
            type="button"
            onClick={() => setType(key)}
            className={cn(
              "rounded-2xl border-2 p-4 text-left transition",
              type === key ? "border-brand-400 bg-brand-50 shadow-sm" : "border-ink-200 bg-white hover:border-brand-200",
            )}
          >
            <Icon className={cn("mb-2 h-6 w-6", type === key ? "text-brand-500" : "text-ink-400")} />
            <div className="text-sm font-black text-ink-900">{label}</div>
            <div className="text-[11px] leading-snug text-ink-500">{hint}</div>
          </button>
        ))}
      </div>

      <MediaUploader items={media} onChange={setMedia} allowPanorama max={type === "PHOTO" ? 10 : 3} />

      <Field label="Caption">
        <textarea
          className={cn(inputClass, "min-h-28 resize-y")}
          maxLength={2200}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Sunrise over Pangong after a 6-hour drive from Leh. Worth every pothole."
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Location">
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-500" />
            <input className={cn(inputClass, "pl-11")} value={locationName} onChange={(e) => setLocationName(e.target.value)} placeholder="Pangong Tso" />
          </div>
        </Field>
        <Field label="Country">
          <input className={inputClass} value={country} onChange={(e) => setCountry(e.target.value)} placeholder="India" />
        </Field>
      </div>

      <Field label="Tags" hint="Press Enter to add. These power search and the explore page.">
        <div className="flex gap-2">
          <input
            className={inputClass}
            value={tagDraft}
            onChange={(e) => setTagDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="roadtrip"
          />
          <button type="button" onClick={addTag} className="rounded-2xl border border-ink-200 bg-white px-4 text-sm font-bold text-ink-700">
            Add
          </button>
        </div>
      </Field>
      {tags.length ? (
        <div className="-mt-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button key={tag} type="button" onClick={() => setTags(tags.filter((t) => t !== tag))}>
              <Chip active>#{tag} ✕</Chip>
            </button>
          ))}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Trip budget" hint="Shown as a badge on your post">
          <div className="relative">
            <Wallet className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />
            <input className={cn(inputClass, "pl-11")} type="number" min={0} value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="18000" />
          </div>
        </Field>
        <Field label="When did you go?">
          <select className={inputClass} value={tripMonth} onChange={(e) => setTripMonth(e.target.value)}>
            <option value="">Select month</option>
            {MONTHS.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Rate this place">
          <div className="flex h-11 items-center gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button key={value} type="button" onClick={() => setRating(rating === value ? 0 : value)} aria-label={`${value} stars`}>
                <Star className={cn("h-6 w-6 transition", value <= rating ? "fill-amber-400 text-amber-400" : "text-ink-200")} />
              </button>
            ))}
          </div>
        </Field>
      </div>

      {(itineraries.length > 0 || packages.length > 0) ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {itineraries.length ? (
            <Field label="Attach an itinerary" hint="Readers can open your full day-by-day plan">
              <select className={inputClass} value={itineraryId} onChange={(e) => setItineraryId(e.target.value)}>
                <option value="">None</option>
                {itineraries.map((itinerary) => (
                  <option key={itinerary.id} value={itinerary.id}>
                    {itinerary.title}
                  </option>
                ))}
              </select>
            </Field>
          ) : null}
          {packages.length ? (
            <Field label="Promote a package" hint="Adds a Book button to your post">
              <select className={inputClass} value={packageId} onChange={(e) => setPackageId(e.target.value)}>
                <option value="">None</option>
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.title}
                  </option>
                ))}
              </select>
            </Field>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" size="lg" disabled={busy}>
          {busy ? "Publishing…" : "Publish post"}
        </Button>
        <Button href="/itineraries/new" variant="outline" size="lg">
          <Route className="h-4 w-4" /> Build an itinerary instead
        </Button>
      </div>
    </form>
  );
}
