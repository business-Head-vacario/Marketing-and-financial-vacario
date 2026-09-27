import { requireUser } from "@/lib/auth";
import { TravellerOnboarding } from "@/components/forms/TravellerOnboarding";
import { parseList } from "@/lib/utils";

export const metadata = { title: "Set up your profile" };

export default async function OnboardingPage() {
  const user = await requireUser("/login?next=/onboarding");

  return (
    <div className="mx-auto max-w-3xl px-4">
      <div className="mb-6">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-brand-700">
          Step 1 of 1 · takes 2 minutes
        </span>
        <h1 className="mt-3 font-display text-4xl font-black tracking-tight">
          Welcome, <span className="vc-gradient-text">{user.name.split(" ")[0]}</span> 👋
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Tell us how you travel and we&apos;ll shape your feed, itinerary picks and package suggestions around it.
        </p>
      </div>
      <div className="vc-card p-6">
        <TravellerOnboarding
          initial={{
            name: user.name,
            bio: user.bio ?? "",
            homeCity: user.homeCity ?? "",
            country: user.country ?? "",
            website: user.website ?? "",
            avatarUrl: user.avatarUrl ?? "",
            coverUrl: user.coverUrl ?? "",
            interests: parseList(user.interests),
            travelStyle: user.travelStyle ?? "",
          }}
        />
      </div>
    </div>
  );
}
