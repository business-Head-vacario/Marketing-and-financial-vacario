"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check } from "lucide-react";

export function MarkAllRead() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      onClick={async () => {
        setBusy(true);
        await fetch("/api/notifications", { method: "POST" });
        setBusy(false);
        router.refresh();
      }}
      disabled={busy}
      className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-bold text-ink-700 hover:border-brand-300 hover:text-brand-600 disabled:opacity-50"
    >
      <Check className="h-4 w-4" /> {busy ? "Marking…" : "Mark all read"}
    </button>
  );
}
