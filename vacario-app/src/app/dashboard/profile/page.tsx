import { db } from "@/lib/db";
import { requireAgency } from "@/lib/auth";
import { AgencyForm } from "@/components/forms/AgencyForm";
import { parseList } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Agency profile" };

export default async function AgencyProfilePage() {
  const { agency } = await requireAgency();
  const full = await db.agency.findUniqueOrThrow({ where: { id: agency.id } });

  return (
    <div className="mx-auto w-full max-w-3xl px-3 sm:px-4">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-black tracking-tight">Agency profile</h1>
        <p className="text-sm text-ink-500">
          This is what travellers see at /agencies/{full.slug} · status: <strong>{full.status.toLowerCase()}</strong>
        </p>
      </div>
      <div className="vc-card p-6">
        <AgencyForm
          agencyId={full.id}
          submitLabel="Save profile"
          initial={{
            name: full.name,
            tagline: full.tagline,
            about: full.about,
            city: full.city,
            country: full.country,
            address: full.address ?? "",
            phone: full.phone,
            email: full.email,
            website: full.website ?? "",
            licenseNo: full.licenseNo ?? "",
            gstNo: full.gstNo ?? "",
            yearsInBusiness: full.yearsInBusiness,
            teamSize: full.teamSize,
            specialties: parseList(full.specialties),
            languages: parseList(full.languages),
            logoUrl: full.logoUrl ?? "",
            coverUrl: full.coverUrl ?? "",
          }}
        />
      </div>
    </div>
  );
}
