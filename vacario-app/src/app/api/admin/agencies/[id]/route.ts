import { db } from "@/lib/db";
import { ok, toResponse, requireSessionUser, HttpError } from "@/lib/api";
import { agencyStatusSchema } from "@/lib/validators";
import { notify } from "@/lib/notify";

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireSessionUser();
    if (user.role !== "ADMIN") throw new HttpError("Admins only", 403);

    const { id } = await ctx.params;
    const { status, reviewNote } = agencyStatusSchema.parse(await request.json());

    const agency = await db.agency.update({
      where: { id },
      data: { status, reviewNote: reviewNote || null },
      select: { id: true, name: true, slug: true, status: true, ownerId: true },
    });

    await notify({
      userId: agency.ownerId,
      actorId: user.id,
      type: "AGENCY_STATUS",
      message:
        status === "VERIFIED"
          ? `${agency.name} is now a verified Vacario agency 🎉`
          : `${agency.name} verification was ${status.toLowerCase()}${reviewNote ? `: ${reviewNote}` : ""}`,
      href: `/agencies/${agency.slug}`,
    });

    return ok({ agency });
  } catch (error) {
    return toResponse(error);
  }
}
