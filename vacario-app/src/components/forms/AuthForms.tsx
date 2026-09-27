"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Building, Compass, Eye, Lock, Mail, UserPlus } from "lucide-react";
import { Alert, Button, Field, inputClass } from "@/components/ui";
import { cn } from "@/lib/utils";

function useAuthSubmit(endpoint: string) {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(payload: Record<string, unknown>) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }
      const next = params.get("next") || data.next || "/";
      router.push(next);
      router.refresh();
    } catch {
      setError("Network error — please try again");
    } finally {
      setBusy(false);
    }
  }

  return { submit, error, busy, setError };
}

export function LoginForm() {
  const { submit, error, busy } = useAuthSubmit("/api/auth/login");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [reveal, setReveal] = useState(false);

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        void submit({ identifier, password });
      }}
    >
      {error ? <Alert>{error}</Alert> : null}
      <Field label="Email or username" required>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            className={cn(inputClass, "pl-11")}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="you@example.com"
            autoComplete="username"
            required
          />
        </div>
      </Field>
      <Field label="Password" required>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            className={cn(inputClass, "pl-11 pr-11")}
            type={reveal ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            aria-label="Show password"
            onClick={() => setReveal((r) => !r)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-ink-400 hover:text-ink-700"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </Field>
      <Button type="submit" full size="lg" disabled={busy}>
        {busy ? "Signing in…" : "Log in"}
      </Button>
      <p className="text-center text-sm text-ink-500">
        New to Vacario?{" "}
        <Link href="/signup" className="font-bold text-brand-600 hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}

export function SignupForm({ defaultRole = "TRAVELLER" }: { defaultRole?: "TRAVELLER" | "AGENT" }) {
  const { submit, error, busy } = useAuthSubmit("/api/auth/signup");
  const [role, setRole] = useState<"TRAVELLER" | "AGENT">(defaultRole);
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        void submit({ ...form, username: form.username.toLowerCase(), role });
      }}
    >
      {error ? <Alert>{error}</Alert> : null}

      <div className="grid grid-cols-2 gap-3">
        {(
          [
            { value: "TRAVELLER", label: "I'm a traveller", icon: Compass, note: "Post trips, plan, book" },
            { value: "AGENT", label: "I'm a travel agent", icon: Building, note: "Sell packages, get leads" },
          ] as const
        ).map(({ value, label, icon: Icon, note }) => (
          <button
            key={value}
            type="button"
            onClick={() => setRole(value)}
            className={cn(
              "rounded-2xl border-2 p-3 text-left transition",
              role === value
                ? "border-brand-400 bg-brand-50 shadow-sm"
                : "border-ink-200 bg-white hover:border-brand-200",
            )}
          >
            <Icon className={cn("mb-1.5 h-5 w-5", role === value ? "text-brand-500" : "text-ink-400")} />
            <div className="text-sm font-bold text-ink-900">{label}</div>
            <div className="text-[11px] text-ink-500">{note}</div>
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" required>
          <input className={inputClass} value={form.name} onChange={set("name")} placeholder="Ananya Rao" required />
        </Field>
        <Field label="Username" required hint="vacario.app/u/yourname">
          <input
            className={inputClass}
            value={form.username}
            onChange={set("username")}
            placeholder="ananya.travels"
            pattern="[A-Za-z0-9._]{3,24}"
            required
          />
        </Field>
      </div>
      <Field label="Email" required>
        <input className={inputClass} type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" required />
      </Field>
      <Field label="Password" required hint="At least 8 characters">
        <input
          className={inputClass}
          type="password"
          value={form.password}
          onChange={set("password")}
          placeholder="••••••••"
          minLength={8}
          required
          autoComplete="new-password"
        />
      </Field>

      <Button type="submit" full size="lg" disabled={busy}>
        <UserPlus className="h-4 w-4" />
        {busy ? "Creating account…" : role === "AGENT" ? "Create agent account" : "Join Vacario"}
      </Button>
      <p className="text-center text-sm text-ink-500">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-brand-600 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
