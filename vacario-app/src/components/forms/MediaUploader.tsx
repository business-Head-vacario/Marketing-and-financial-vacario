"use client";

import { useRef, useState } from "react";
import { Image as ImageIcon, Link2, Rotate3d, Trash, Upload, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MediaItem } from "@/components/media/MediaView";
import { Panorama } from "@/components/media/Panorama";

const KIND_ICON = { IMAGE: ImageIcon, VIDEO: Video, PANORAMA: Rotate3d };

export function MediaUploader({
  items,
  onChange,
  max = 10,
  allowPanorama = true,
  label = "Photos, videos & 360° shots",
}: {
  items: MediaItem[];
  onChange: (items: MediaItem[]) => void;
  max?: number;
  allowPanorama?: boolean;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlDraft, setUrlDraft] = useState("");
  const [dragging, setDragging] = useState(false);

  async function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files).slice(0, max - items.length);
    if (!list.length) return;
    setBusy(true);
    setError(null);
    const added: MediaItem[] = [];
    for (const file of list) {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Upload failed");
        break;
      }
      added.push({ url: data.url, kind: data.kind, alt: file.name });
    }
    if (added.length) onChange([...items, ...added]);
    setBusy(false);
  }

  function addUrl() {
    const url = urlDraft.trim();
    if (!url) return;
    const kind = /\.(mp4|webm|mov)(\?|$)/i.test(url) ? "VIDEO" : "IMAGE";
    onChange([...items, { url, kind }]);
    setUrlDraft("");
  }

  function update(index: number, patch: Partial<MediaItem>) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  return (
    <div className="space-y-3">
      <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-ink-500">{label}</span>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void uploadFiles(e.dataTransfer.files);
        }}
        className={cn(
          "grid cursor-pointer place-items-center gap-2 rounded-3xl border-2 border-dashed px-6 py-8 text-center transition",
          dragging ? "border-brand-400 bg-brand-50" : "border-ink-200 bg-white hover:border-brand-300 hover:bg-brand-50/40",
        )}
        onClick={() => inputRef.current?.click()}
      >
        <span className="grid h-12 w-12 place-items-center rounded-2xl vc-sunset text-white">
          <Upload className="h-5 w-5" />
        </span>
        <span className="text-sm font-bold text-ink-800">
          {busy ? "Uploading…" : "Drop files here or click to browse"}
        </span>
        <span className="text-xs text-ink-400">
          JPG, PNG, WEBP, MP4 or WEBM · up to 40 MB each · {items.length}/{max} added
        </span>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/mp4,video/webm,video/quicktime"
          className="hidden"
          onChange={(e) => {
            if (e.target.files) void uploadFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addUrl();
              }
            }}
            placeholder="…or paste an image / video URL"
            className="w-full rounded-2xl border border-ink-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
          />
        </div>
        <button
          type="button"
          onClick={addUrl}
          className="rounded-2xl border border-ink-200 bg-white px-4 text-sm font-bold text-ink-700 hover:border-brand-300 hover:text-brand-600"
        >
          Add
        </button>
      </div>

      {error ? <p className="text-xs font-semibold text-rose-600">{error}</p> : null}

      {items.length ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((item, index) => {
            const Icon = KIND_ICON[item.kind as keyof typeof KIND_ICON] ?? ImageIcon;
            return (
              <li key={`${item.url}-${index}`} className="overflow-hidden rounded-2xl border border-ink-200 bg-white">
                <div className="relative aspect-square bg-ink-100">
                  {item.kind === "PANORAMA" ? (
                    <Panorama src={item.url} className="h-full w-full" showHint={false} autoRotate={false} />
                  ) : item.kind === "VIDEO" ? (
                    <video src={item.url} className="h-full w-full object-cover" muted playsInline />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.url} alt="" className="h-full w-full object-cover" />
                  )}
                  <button
                    type="button"
                    aria-label="Remove media"
                    onClick={() => onChange(items.filter((_, i) => i !== index))}
                    className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-rose-600 shadow"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center gap-1.5 p-2">
                  <Icon className="h-3.5 w-3.5 shrink-0 text-ink-400" />
                  <select
                    value={item.kind}
                    onChange={(e) => update(index, { kind: e.target.value })}
                    className="w-full rounded-lg border border-ink-200 bg-white px-1.5 py-1 text-[11px] font-semibold outline-none"
                  >
                    <option value="IMAGE">Photo</option>
                    <option value="VIDEO">Video / reel</option>
                    {allowPanorama ? <option value="PANORAMA">360° panorama</option> : null}
                  </select>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
