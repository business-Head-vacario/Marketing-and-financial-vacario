import { Suspense } from "react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Composer } from "@/components/forms/Composer";

export const metadata = { title: "Create a post" };

export default async function CreatePage() {
  const user = await requireUser("/login?next=/create");

  const [itineraries, packages] = await Promise.all([
    db.itinerary.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true },
      take: 30,
    }),
    user.agency
      ? db.package.findMany({
          where: { agencyId: user.agency.id, status: "PUBLISHED" },
          orderBy: { createdAt: "desc" },
          select: { id: true, title: true },
          take: 30,
        })
      : Promise.resolve([]),
  ]);

  return (
    <div className="mx-auto w-full max-w-3xl px-3 sm:px-4">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
          Share a <span className="vc-gradient-text">trip</span>
        </h1>
        <p className="text-sm text-ink-500">Photos, a reel or a drag-to-explore 360° view — plus the details that help people copy it.</p>
      </div>
      <div className="vc-card p-5 sm:p-6">
        <Suspense fallback={null}>
          <Composer itineraries={itineraries} packages={packages} />
        </Suspense>
      </div>
    </div>
  );
}
