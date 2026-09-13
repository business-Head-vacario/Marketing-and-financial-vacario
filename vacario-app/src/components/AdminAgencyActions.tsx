"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, X } from "lucide-react";

export function AdminAgencyActions({ agencyId, status }: { agencyId: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function decide(next: "VERIFIED" | "REJECTED" | "PENDING") {
    setBusy(next);
    setError(null);
    const res = await fetch(`/api/admin/agencies/${agencyId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: next, reviewNote: note }),
    });
    setBusy(null);
    if (!res.ok) return setError((await res.json()).error ?? "Could not update");
    setNote("");
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Review note (optional)"
        className="min-w-40 flex-1 rounded-full border border-ink-200 px-3.5 py-2 text-xs outline-none focus:border-brand-400"
      />
      {status !== "VERIFIED" ? (
        <button
          onClick={() => decide("VERIFIED")}
          disabled={busy !== null}
          className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          <Check className="h-3.5 w-3.5" /> {busy === "VERIFIED" ? "Verifying…" : "Verify"}
        </button>
      ) : null}
      {status !== "REJECTED" ? (
        <button
          onClick={() => decide("REJECTED")}
          disabled={busy !== null}
          className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
        >
          <X className="h-3.5 w-3.5" /> Reject
        </button>
      ) : null}
      {status !== "PENDING" ? (
        <button
          onClick={() => decide("PENDING")}
          disabled={busy !== null}
          className="rounded-full border border-ink-200 bg-white px-4 py-2 text-xs font-bold text-ink-600 hover:border-amber-300 disabled:opacity-50"
        >
          Reset to pending
        </button>
      ) : null}
      {error ? <span className="text-xs font-semibold text-rose-600">{error}</span> : null}
    </div>
  );
}
