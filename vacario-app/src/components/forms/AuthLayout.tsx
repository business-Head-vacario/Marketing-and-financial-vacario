import type { ReactNode } from "react";
import { Globe, Rotate3d, Route, Ticket } from "lucide-react";

const PERKS = [
  { icon: Route, title: "Day-by-day itineraries", body: "Publish plans with costs, stays and stops others can copy." },
  { icon: Rotate3d, title: "360° travel content", body: "Drop viewers inside the view — draggable panoramas, in-feed." },
  { icon: Ticket, title: "Book real packages", body: "Verified agencies, transparent pricing, instant confirmation." },
  { icon: Globe, title: "One travel identity", body: "Photos, reels and trips on a profile built for travellers." },
];

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="mx-auto grid max-w-5xl items-stretch gap-6 px-4 lg:grid-cols-[1.05fr_1fr]">
      <section className="relative hidden overflow-hidden rounded-[2rem] vc-sunset p-8 text-white lg:block">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/15 blur-2xl" />
        <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-lagoon-300/30 blur-3xl" />
        <div className="relative flex h-full flex-col">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-white/80">Vacario</p>
          <h2 className="mt-3 font-display text-4xl font-black leading-tight">
            Travel looks better
            <br />
            when it&apos;s shared.
          </h2>
          <p className="mt-3 max-w-sm text-sm text-white/85">
            The social network built only for travel — and the marketplace where the trips you scroll past are
            actually bookable.
          </p>
          <ul className="mt-8 space-y-4">
            {PERKS.map(({ icon: Icon, title: perkTitle, body }) => (
              <li key={perkTitle} className="flex gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/20">
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-bold">{perkTitle}</span>
                  <span className="block text-xs text-white/80">{body}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex gap-6 pt-8 text-center">
            {[
              ["12k+", "trips shared"],
              ["480+", "agencies"],
              ["4.8★", "avg rating"],
            ].map(([value, label]) => (
              <div key={label}>
                <div className="font-display text-2xl font-black">{value}</div>
                <div className="text-[11px] uppercase tracking-wide text-white/75">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="vc-card p-6 sm:p-8">
        <h1 className="font-display text-3xl font-black tracking-tight text-ink-900">{title}</h1>
        <p className="mt-1 mb-6 text-sm text-ink-500">{subtitle}</p>
        {children}
      </section>
    </div>
  );
}
