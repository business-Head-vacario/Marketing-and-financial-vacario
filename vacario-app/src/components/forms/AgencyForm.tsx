"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Building, Camera, Check, ChevronLeft, ShieldCheck } from "lucide-react";
import { Alert, Button, Chip, Field, inputClass } from "@/components/ui";
import { AGENCY_SPECIALTIES, LANGUAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export type AgencyFormValues = {
  name: string;
  tagline: string;
  about: string;
  city: string;
  country: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  licenseNo: string;
  gstNo: string;
  yearsInBusiness: number;
  teamSize: number;
  specialties: string[];
  languages: string[];
  logoUrl: string;
  coverUrl: string;
};

const STEPS = ["Agency", "Contact & licence", "Profile"];

export function AgencyForm({
  initial,
  agencyId,
  submitLabel = "Submit for verification",
}: {
  initial: AgencyFormValues;
  agencyId?: string;
  submitLabel?: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const set = <K extends keyof AgencyFormValues>(key: K, value: AgencyFormValues[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggle = (key: "specialties" | "languages", value: string) =>
    set(key, form[key].includes(value) ? form[key].filter((v) => v !== value) : [...form[key], value]);

  async function upload(file: File, field: "logoUrl" | "coverUrl") {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body });
    const data = await res.json();
    if (res.ok) set(field, data.url);
    else setError(data.error ?? "Upload failed");
  }

  function validateStep(index: number) {
    if (index === 0 && (!form.name.trim() || !form.city.trim())) return "Agency name and city are required";
    if (index === 1 && (!form.phone.trim() || !form.email.trim())) return "A contact number and business email are required";
    return null;
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    for (let i = 0; i <= 1; i++) {
      const message = validateStep(i);
      if (message) {
        setStep(i);
        setError(message);
        return;
      }
    }
    setBusy(true);
    setError(null);
    const res = await fetch(agencyId ? `/api/agencies/${agencyId}` : "/api/agencies", {
      method: agencyId ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error ?? "Could not save your agency");
      return;
    }
    setDone(true);
    router.push(data.next ?? "/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* stepper */}
      <ol className="flex items-center gap-2">
        {STEPS.map((label, index) => (
          <li key={label} className="flex flex-1 items-center gap-2">
            <button
              type="button"
              onClick={() => setStep(index)}
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black transition",
                index <= step ? "vc-sunset text-white shadow" : "bg-ink-100 text-ink-400",
              )}
            >
              {index < step ? <Check className="h-4 w-4" /> : index + 1}
            </button>
            <span className={cn("hidden text-xs font-bold sm:block", index <= step ? "text-ink-900" : "text-ink-400")}>
              {label}
            </span>
            {index < STEPS.length - 1 ? <span className="h-px flex-1 bg-ink-200" /> : null}
          </li>
        ))}
      </ol>

      {error ? <Alert>{error}</Alert> : null}
      {done ? <Alert tone="success">Saved! Redirecting to your dashboard…</Alert> : null}

      {step === 0 ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Agency name" required>
              <input className={inputClass} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Himalaya Trails Pvt Ltd" required />
            </Field>
            <Field label="Tagline" hint="One line travellers will see first">
              <input className={inputClass} value={form.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="Small-group treks since 2011" />
            </Field>
            <Field label="City" required>
              <input className={inputClass} value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Manali" required />
            </Field>
            <Field label="Country">
              <input className={inputClass} value={form.country} onChange={(e) => set("country", e.target.value)} />
            </Field>
            <Field label="Years in business">
              <input
                className={inputClass}
                type="number"
                min={0}
                max={100}
                value={form.yearsInBusiness}
                onChange={(e) => set("yearsInBusiness", Number(e.target.value))}
              />
            </Field>
            <Field label="Team size">
              <input
                className={inputClass}
                type="number"
                min={1}
                value={form.teamSize}
                onChange={(e) => set("teamSize", Number(e.target.value))}
              />
            </Field>
          </div>
          <Field label="Office address">
            <input className={inputClass} value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Old Manali Road, near HPTDC" />
          </Field>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Contact number" required>
              <input className={inputClass} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 98xxxxxx21" required />
            </Field>
            <Field label="Business email" required>
              <input className={inputClass} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="hello@agency.com" required />
            </Field>
            <Field label="Website">
              <input className={inputClass} value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="www.agency.com" />
            </Field>
            <Field label="Tourism licence / registration no." hint="Speeds up verification">
              <input className={inputClass} value={form.licenseNo} onChange={(e) => set("licenseNo", e.target.value)} placeholder="MOT/2019/00421" />
            </Field>
            <Field label="GST / tax number">
              <input className={inputClass} value={form.gstNo} onChange={(e) => set("gstNo", e.target.value)} placeholder="02ABCDE1234F1Z5" />
            </Field>
          </div>
          <div className="flex items-start gap-3 rounded-2xl border border-lagoon-200 bg-lagoon-50 p-4">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-lagoon-600" />
            <p className="text-xs text-lagoon-800">
              Verification is manual. You can publish packages and take bookings straight away — the blue tick appears
              on your portfolio once our team checks your licence details.
            </p>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-5">
          <div className="relative overflow-hidden rounded-3xl border border-ink-200">
            <div
              className="h-32 w-full bg-cover bg-center vc-lagoon"
              style={form.coverUrl ? { backgroundImage: `url(${form.coverUrl})` } : undefined}
            />
            <label className="absolute right-3 top-3 flex cursor-pointer items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold shadow">
              <Camera className="h-3.5 w-3.5" /> Cover
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && void upload(e.target.files[0], "coverUrl")} />
            </label>
            <div className="flex items-end gap-4 bg-white p-4">
              <label className="-mt-12 cursor-pointer">
                <span className="relative grid h-20 w-20 place-items-center overflow-hidden rounded-2xl border-4 border-white bg-ink-100 shadow">
                  {form.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={form.logoUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Building className="h-7 w-7 text-ink-400" />
                  )}
                </span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && void upload(e.target.files[0], "logoUrl")} />
              </label>
              <p className="pb-1 text-xs text-ink-400">Upload your logo and a cover photo of your best trip.</p>
            </div>
          </div>

          <Field label="About the agency" hint={`${form.about.length}/2000`}>
            <textarea
              className={cn(inputClass, "min-h-32 resize-y")}
              maxLength={2000}
              value={form.about}
              onChange={(e) => set("about", e.target.value)}
              placeholder="Who you are, the trips you run, what makes them different…"
            />
          </Field>

          <div>
            <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-ink-500">Specialities</span>
            <div className="flex flex-wrap gap-2">
              {AGENCY_SPECIALTIES.map((item) => (
                <button key={item} type="button" onClick={() => toggle("specialties", item)}>
                  <Chip active={form.specialties.includes(item)}>{item}</Chip>
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-ink-500">Languages spoken</span>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((item) => (
                <button key={item} type="button" onClick={() => toggle("languages", item)}>
                  <Chip active={form.languages.includes(item)}>{item}</Chip>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        {step > 0 ? (
          <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
        ) : null}
        {step < STEPS.length - 1 ? (
          <Button
            className="ml-auto"
            onClick={() => {
              const message = validateStep(step);
              if (message) return setError(message);
              setError(null);
              setStep((s) => s + 1);
            }}
          >
            Continue <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button type="submit" className="ml-auto" size="lg" disabled={busy}>
            {busy ? "Saving…" : submitLabel}
          </Button>
        )}
      </div>
    </form>
  );
}
