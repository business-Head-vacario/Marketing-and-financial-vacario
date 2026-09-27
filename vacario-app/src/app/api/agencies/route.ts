import { db } from "@/lib/db";
import { ok, toResponse, requireSessionUser, HttpError } from "@/lib/api";
import { agencySchema } from "@/lib/validators";
import { slugify, stringifyList } from "@/lib/utils";
import { notify } from "@/lib/notify";

/** Agent onboarding: creates the agency profile and flips the account to AGENT. */
export async function POST(request: Request) {
  try {
    const user = await requireSessionUser();
    if (user.agency) throw new HttpError("Your account already has an agency profile", 409);

    const input = agencySchema.parse(await request.json());

    let slug = slugify(input.name) || `agency-${Date.now()}`;
    for (let attempt = 1; await db.agency.findUnique({ where: { slug }, select: { id: true } }); attempt++) {
      slug = `${slugify(input.name)}-${attempt}`;
    }

    const agency = await db.agency.create({
      data: {
        ownerId: user.id,
        name: input.name,
        slug,
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
        status: "PENDING",
      },
      select: { id: true, slug: true, name: true, status: true },
    });

    await db.user.update({ where: { id: user.id }, data: { role: user.role === "ADMIN" ? "ADMIN" : "AGENT", onboarded: true } });
    await notify({
      userId: user.id,
      type: "AGENCY_STATUS",
      message: `${agency.name} was submitted for verification. You can publish packages right away.`,
      href: "/dashboard",
    });

    return ok({ agency, next: "/dashboard" }, 201);
  } catch (error) {
    return toResponse(error);
  }
}
