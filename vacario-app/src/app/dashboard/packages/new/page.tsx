import { requireAgency } from "@/lib/auth";
import { PackageForm } from "@/components/forms/PackageForm";

export const metadata = { title: "New package" };

export default async function NewPackagePage() {
  const { agency } = await requireAgency();

  return (
    <div className="mx-auto w-full max-w-4xl px-3 sm:px-4">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-black tracking-tight">
          New <span className="vc-gradient-text">package</span>
        </h1>
        <p className="text-sm text-ink-500">Listing for {agency.name}. Travellers can book it the moment you publish.</p>
      </div>
      <PackageForm
        initial={{
          title: "",
          destination: "",
          country: "India",
          startCity: "",
          summary: "",
          description: "",
          category: "ADVENTURE",
          durationDays: 5,
          durationNights: 4,
          price: 24999,
          currency: "INR",
          discountPercent: 0,
          minGuests: 1,
          maxGuests: 12,
          inclusions: [],
          exclusions: [],
          highlights: [],
          images: [],
          availableFrom: "",
          availableTo: "",
          instantBook: true,
          status: "PUBLISHED",
          dayPlans: [],
        }}
      />
    </div>
  );
}
