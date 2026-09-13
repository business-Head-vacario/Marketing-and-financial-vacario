import { requireUser } from "@/lib/auth";
import { ItineraryBuilder } from "@/components/forms/ItineraryBuilder";

export const metadata = { title: "Build an itinerary" };

export default async function NewItineraryPage() {
  await requireUser("/login?next=/itineraries/new");

  return (
    <div className="mx-auto w-full max-w-4xl px-3 sm:px-4">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
          Build a <span className="vc-gradient-text">day-by-day plan</span>
        </h1>
        <p className="text-sm text-ink-500">
          Add stops with times and costs. Anyone can copy your plan into their own account and edit it.
        </p>
      </div>
      <ItineraryBuilder />
    </div>
  );
}
