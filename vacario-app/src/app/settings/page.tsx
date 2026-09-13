import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { TravellerOnboarding } from "@/components/forms/TravellerOnboarding";
import { LogoutButton } from "@/components/Shell";
import { parseList } from "@/lib/utils";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await requireUser("/login?next=/settings");

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4">
      <div>
        <h1 className="font-display text-3xl font-black tracking-tight">Settings</h1>
        <p className="text-sm text-ink-500">
          Signed in as <span className="font-bold text-ink-700">@{user.username}</span> · {user.email}
        </p>
      </div>

      <div className="vc-card p-6">
        <TravellerOnboarding
          submitLabel="Save changes"
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

      <div className="vc-card flex flex-wrap items-center justify-between gap-3 p-6">
        <div>
          <h2 className="font-display text-lg font-bold">Travel business</h2>
          <p className="text-sm text-ink-500">
            {user.agency
              ? `Managing ${user.agency.name} · ${user.agency.status.toLowerCase()}`
              : "Run a travel agency? List it and start selling packages."}
          </p>
        </div>
        <Link
          href={user.agency ? "/dashboard" : "/onboarding/agent"}
          className="rounded-full vc-lagoon px-4 py-2.5 text-sm font-bold text-white shadow"
        >
          {user.agency ? "Open dashboard" : "List my agency"}
        </Link>
      </div>

      <div className="vc-card flex items-center justify-between gap-3 p-6">
        <div>
          <h2 className="font-display text-lg font-bold">Session</h2>
          <p className="text-sm text-ink-500">Log out of Vacario on this device.</p>
        </div>
        <LogoutButton withLabel />
      </div>
    </div>
  );
}
