"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

export function BookingActions({
  bookingId,
  status,
  role,
  size = "md",
}: {
  bookingId: string;
  status: Status;
  role: "traveller" | "agency";
  size?: "sm" | "md";
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function update(next: Status) {
    setBusy(next);
    setError(null);
    const res = await fetch(`/api/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    const data = await res.json();
    setBusy(null);
    if (!res.ok) return setError(data.error ?? "Could not update this booking");
    router.refresh();
  }

  const base = cn(
    "inline-flex items-center gap-1.5 rounded-full font-bold transition disabled:opacity-50",
    size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
  );

  if (status === "CANCELLED" || status === "COMPLETED") {
    return <span className="text-xs font-semibold text-ink-400">No actions available</span>;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {role === "agency" && status === "PENDING" ? (
        <button onClick={() => update("CONFIRMED")} disabled={busy !== null} className={cn(base, "bg-emerald-600 text-white hover:bg-emerald-700")}>
          <Check className="h-3.5 w-3.5" /> {busy === "CONFIRMED" ? "Confirming…" : "Confirm"}
        </button>
      ) : null}
      {role === "agency" && status === "CONFIRMED" ? (
        <button onClick={() => update("COMPLETED")} disabled={busy !== null} className={cn(base, "bg-ink-900 text-white hover:bg-ink-800")}>
          <Check className="h-3.5 w-3.5" /> {busy === "COMPLETED" ? "Saving…" : "Mark completed"}
        </button>
      ) : null}
      <button
        onClick={() => update("CANCELLED")}
        disabled={busy !== null}
        className={cn(base, "border border-ink-200 bg-white text-rose-600 hover:border-rose-200 hover:bg-rose-50")}
      >
        <X className="h-3.5 w-3.5" /> {busy === "CANCELLED" ? "Cancelling…" : "Cancel"}
      </button>
      {error ? <span className="text-xs font-semibold text-rose-600">{error}</span> : null}
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const tones: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-700",
    CONFIRMED: "bg-emerald-100 text-emerald-700",
    CANCELLED: "bg-rose-100 text-rose-700",
    COMPLETED: "bg-ink-900 text-white",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-wide", tones[status] ?? "bg-ink-100 text-ink-600")}>
      {status.toLowerCase()}
    </span>
  );
}
