"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, Pencil, Trash } from "lucide-react";
import Link from "next/link";

export function PackageRowActions({ id, slug, status }: { id: string; slug: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  async function setStatus(next: string) {
    setBusy(true);
    const res = await fetch(`/api/packages/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setBusy(false);
    if (res.ok) router.refresh();
    else setNote((await res.json()).error ?? "Could not update");
  }

  async function remove() {
    if (!confirm("Delete this package? Packages with live bookings are archived instead.")) return;
    setBusy(true);
    const res = await fetch(`/api/packages/${id}`, { method: "DELETE" });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) return setNote(data.error ?? "Could not delete");
    if (data.reason) setNote(data.reason);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link href={`/packages/${slug}`} className="rounded-full border border-ink-200 bg-white p-2 text-ink-600 hover:border-brand-300 hover:text-brand-600" title="View">
        <Eye className="h-4 w-4" />
      </Link>
      <Link href={`/dashboard/packages/${id}/edit`} className="rounded-full border border-ink-200 bg-white p-2 text-ink-600 hover:border-brand-300 hover:text-brand-600" title="Edit">
        <Pencil className="h-4 w-4" />
      </Link>
      <button
        onClick={() => setStatus(status === "PUBLISHED" ? "DRAFT" : "PUBLISHED")}
        disabled={busy}
        className="rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs font-bold text-ink-700 hover:border-brand-300 disabled:opacity-50"
      >
        {status === "PUBLISHED" ? "Unpublish" : "Publish"}
      </button>
      <button onClick={remove} disabled={busy} className="rounded-full border border-ink-200 bg-white p-2 text-rose-500 hover:border-rose-200 hover:bg-rose-50 disabled:opacity-50" title="Delete">
        <Trash className="h-4 w-4" />
      </button>
      {note ? <span className="text-[11px] font-semibold text-amber-600">{note}</span> : null}
    </div>
  );
}
