import Link from "next/link";
import { redirect } from "next/navigation";
import { BadgeCheck, TrendingUp, Users, Wallet } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { AgencyForm } from "@/components/forms/AgencyForm";

export const metadata = { title: "List your travel agency" };

const PERKS = [
  { icon: Users, title: "Reach travellers mid-daydream", body: "Your packages appear beside the trips they're already scrolling." },
  { icon: Wallet, title: "Bookings, not just enquiries", body: "Travellers book and pay in-app; you manage every booking from one dashboard." },
  { icon: BadgeCheck, title: "A verified portfolio", body: "Photos, reels, reviews and past trips on a page that sells for you." },
  { icon: TrendingUp, title: "Zero listing fee to start", body: "Publish unlimited packages while you build your first reviews." },
];

export default async function AgentOnboardingPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4">
        <div className="vc-card overflow-hidden">
          <div className="vc-lagoon p-8 text-white">
            <h1 className="font-display text-3xl font-black">List your travel agency on Vacario</h1>
            <p className="mt-2 max-w-lg text-sm text-white/85">
              Create an agent account first — it takes a minute — then fill in your agency profile and publish your
              first package.
            </p>
          </div>
          <div className="grid gap-4 p-6 sm:grid-cols-2">
            {PERKS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-ink-100 p-4">
                <Icon className="mb-2 h-5 w-5 text-lagoon-600" />
                <h3 className="text-sm font-bold text-ink-900">{title}</h3>
                <p className="text-xs text-ink-500">{body}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 border-t border-ink-100 p-6">
            <Link href="/signup?role=agent" className="rounded-full vc-sunset px-6 py-3 text-sm font-bold text-white shadow-lg">
              Create agent account
            </Link>
            <Link href="/login?next=/onboarding/agent" className="rounded-full border border-ink-200 bg-white px-6 py-3 text-sm font-bold">
              I already have an account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (user.agency) redirect("/dashboard");

  return (
    <div className="mx-auto max-w-3xl px-4">
      <div className="mb-6">
        <span className="inline-flex items-center gap-2 rounded-full bg-lagoon-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-lagoon-700">
          Agent onboarding
        </span>
        <h1 className="mt-3 font-display text-4xl font-black tracking-tight">
          Set up your <span className="vc-gradient-text">agency profile</span>
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Three short steps. You can publish packages immediately; verification runs in the background.
        </p>
      </div>

      <div className="vc-card p-6">
        <AgencyForm
          initial={{
            name: "",
            tagline: "",
            about: "",
            city: user.homeCity ?? "",
            country: user.country ?? "India",
            address: "",
            phone: "",
            email: user.email,
            website: "",
            licenseNo: "",
            gstNo: "",
            yearsInBusiness: 0,
            teamSize: 1,
            specialties: [],
            languages: ["English", "Hindi"],
            logoUrl: "",
            coverUrl: "",
          }}
        />
      </div>
    </div>
  );
}
