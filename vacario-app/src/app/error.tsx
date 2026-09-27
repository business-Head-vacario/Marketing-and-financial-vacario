"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto grid max-w-lg place-items-center px-4 py-20 text-center">
      <span className="grid h-20 w-20 place-items-center rounded-3xl bg-rose-100 text-3xl">🧭</span>
      <h1 className="mt-5 font-display text-3xl font-black tracking-tight">Something went sideways</h1>
      <p className="mt-2 text-sm text-ink-500">
        {error.message || "An unexpected error occurred while loading this page."}
      </p>
      <button
        onClick={reset}
        className="mt-6 inline-flex items-center gap-2 rounded-full vc-sunset px-6 py-3 text-sm font-bold text-white shadow-lg"
      >
        <RefreshCw className="h-4 w-4" /> Try again
      </button>
    </div>
  );
}
