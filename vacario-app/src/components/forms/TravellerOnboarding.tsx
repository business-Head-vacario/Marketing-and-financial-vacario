"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Camera, Check, Sparkles } from "lucide-react";
import { Alert, Avatar, Button, Chip, Field, inputClass } from "@/components/ui";
import { TRAVEL_INTERESTS, TRAVEL_STYLES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function TravellerOnboarding({
  initial,
  submitLabel = "Finish & explore",
}: {
  initial: {
    name: string;
    bio: string;
    homeCity: string;
    country: string;
    website: string;
    avatarUrl: string;
    coverUrl: string;
    interests: string[];
    travelStyle: string;
  };
  submitLabel?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  function toggleInterest(interest: string) {
    set(
      "interests",
      form.interests.includes(interest)
        ? form.interests.filter((i) => i !== interest)
        : [...form.interests, interest].slice(0, 12),
    );
  }

  async function uploadAvatar(file: File, field: "avatarUrl" | "coverUrl") {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body });
    const data = await res.json();
    if (res.ok) set(field, data.url);
    else setError(data.error ?? "Upload failed");
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error ?? "Could not save your profile");
      return;
    }
    setSaved(true);
    router.push(data.next ?? "/");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {error ? <Alert>{error}</Alert> : null}
      {saved ? <Alert tone="success">Profile saved — welcome aboard!</Alert> : null}

      <div className="relative overflow-hidden rounded-3xl">
        <div className={cn("h-32 w-full bg-cover bg-center vc-sunset")} style={form.coverUrl ? { backgroundImage: `url(${form.coverUrl})` } : undefined} />
        <label className="absolute right-3 top-3 flex cursor-pointer items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-ink-700 shadow">
          <Camera className="h-3.5 w-3.5" /> Cover
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && void uploadAvatar(e.target.files[0], "coverUrl")}
          />
        </label>
        <div className="flex items-end gap-4 bg-white px-4 pb-4 pt-0">
          <label className="-mt-10 cursor-pointer">
            <span className="relative block">
              <Avatar name={form.name || "Traveller"} src={form.avatarUrl} size={84} ring />
              <span className="absolute bottom-0 right-0 grid h-7 w-7 place-items-center rounded-full vc-sunset text-white shadow">
                <Camera className="h-3.5 w-3.5" />
              </span>
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && void uploadAvatar(e.target.files[0], "avatarUrl")}
            />
          </label>
          <p className="pb-2 text-xs text-ink-400">Add a face and a cover — profiles with both get followed 3× more.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Display name" required>
          <input className={inputClass} value={form.name} onChange={(e) => set("name", e.target.value)} required />
        </Field>
        <Field label="Home city">
          <input className={inputClass} value={form.homeCity} onChange={(e) => set("homeCity", e.target.value)} placeholder="Bengaluru" />
        </Field>
        <Field label="Country">
          <input className={inputClass} value={form.country} onChange={(e) => set("country", e.target.value)} placeholder="India" />
        </Field>
        <Field label="Website / social">
          <input className={inputClass} value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="instagram.com/yourhandle" />
        </Field>
      </div>

      <Field label="Bio" hint={`${form.bio.length}/280`}>
        <textarea
          className={cn(inputClass, "min-h-24 resize-y")}
          maxLength={280}
          value={form.bio}
          onChange={(e) => set("bio", e.target.value)}
          placeholder="Weekend trekker. 14 states down, 14 to go. Slow travel and street food."
        />
      </Field>

      <div>
        <span className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-ink-500">
          <Sparkles className="h-3.5 w-3.5 text-brand-500" /> What kind of travel are you into?
        </span>
        <div className="flex flex-wrap gap-2">
          {TRAVEL_INTERESTS.map((interest) => (
            <button key={interest} type="button" onClick={() => toggleInterest(interest)}>
              <Chip active={form.interests.includes(interest)}>
                {form.interests.includes(interest) ? <Check className="h-3 w-3" /> : null}
                {interest}
              </Chip>
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-ink-500">Your travel style</span>
        <div className="flex flex-wrap gap-2">
          {TRAVEL_STYLES.map((style) => (
            <button key={style} type="button" onClick={() => set("travelStyle", style === form.travelStyle ? "" : style)}>
              <Chip active={form.travelStyle === style}>{style}</Chip>
            </button>
          ))}
        </div>
      </div>

      <Button type="submit" size="lg" full disabled={busy}>
        {busy ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
