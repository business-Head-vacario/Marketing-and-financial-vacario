"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Copy } from "lucide-react";

export function ForkButton({ itineraryId, signedIn }: { itineraryId: string; signedIn: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <button
        onClick={async () => {
          if (!signedIn) return router.push(`/login?next=/itineraries/${itineraryId}`);
          setBusy(true);
          const res = await fetch(`/api/itineraries/${itineraryId}`, { method: "POST" });
          const data = await res.json();
          setBusy(false);
          if (!res.ok) return setError(data.error ?? "Could not copy this plan");
          router.push(data.next);
          router.refresh();
        }}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-ink-800 disabled:opacity-60"
      >
        <Copy className="h-4 w-4" /> {busy ? "Copying…" : "Copy this plan"}
      </button>
      {error ? <p className="mt-1 text-xs font-semibold text-rose-600">{error}</p> : null}
    </div>
  );
}
