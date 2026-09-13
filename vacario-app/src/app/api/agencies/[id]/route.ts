import { db } from "@/lib/db";
import { ok, toResponse, requireSessionUser, HttpError } from "@/lib/api";
import { agencySchema } from "@/lib/validators";
import { stringifyList } from "@/lib/utils";

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireSessionUser();
    const { id } = await ctx.params;

    const agency = await db.agency.findUnique({ where: { id }, select: { ownerId: true } });
    if (!agency) throw new HttpError("Agency not found", 404);
    if (agency.ownerId !== user.id && user.role !== "ADMIN") throw new HttpError("Not your agency", 403);

    const input = agencySchema.parse(await request.json());
    const updated = await db.agency.update({
      where: { id },
      data: {
        name: input.name,
        tagline: input.tagline ?? "",
        about: input.about ?? "",
        city: input.city,
        country: input.country,
        address: input.address || null,
        phone: input.phone,
        email: input.email,
        website: input.website || null,
        licenseNo: input.licenseNo || null,
        gstNo: input.gstNo || null,
        yearsInBusiness: input.yearsInBusiness,
        teamSize: input.teamSize,
        specialties: stringifyList(input.specialties),
        languages: stringifyList(input.languages),
        logoUrl: input.logoUrl || null,
        coverUrl: input.coverUrl || null,
      },
      select: { id: true, slug: true, name: true, status: true },
    });

    return ok({ agency: updated, next: `/agencies/${updated.slug}` });
  } catch (error) {
    return toResponse(error);
  }
}
