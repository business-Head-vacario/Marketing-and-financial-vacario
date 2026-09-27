import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto grid max-w-lg place-items-center px-4 py-20 text-center">
      <span className="grid h-20 w-20 place-items-center rounded-3xl vc-sunset text-white vc-float">
        <Compass className="h-9 w-9" />
      </span>
      <h1 className="mt-5 font-display text-4xl font-black tracking-tight">Off the map</h1>
      <p className="mt-2 text-sm text-ink-500">
        This page doesn&apos;t exist — or the trip it belonged to was taken down.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/" className="rounded-full vc-sunset px-6 py-3 text-sm font-bold text-white shadow-lg">
          Back to the feed
        </Link>
        <Link href="/explore" className="rounded-full border border-ink-200 bg-white px-6 py-3 text-sm font-bold">
          Explore trips
        </Link>
      </div>
    </div>
  );
}
