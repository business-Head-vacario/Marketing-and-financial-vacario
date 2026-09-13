import { db } from "@/lib/db";
import { hashPassword, startSession } from "@/lib/auth";
import { ok, toResponse, HttpError } from "@/lib/api";
import { signupSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const input = signupSchema.parse(await request.json());

    const clash = await db.user.findFirst({
      where: { OR: [{ email: input.email }, { username: input.username }] },
      select: { email: true, username: true },
    });
    if (clash?.email === input.email) throw new HttpError("An account with this email already exists", 409);
    if (clash) throw new HttpError("That username is taken", 409);

    const user = await db.user.create({
      data: {
        name: input.name,
        email: input.email,
        username: input.username,
        passwordHash: await hashPassword(input.password),
        role: input.role,
      },
      select: { id: true, username: true, role: true },
    });

    await startSession(user);
    return ok({
      user,
      next: input.role === "AGENT" ? "/onboarding/agent" : "/onboarding",
    }, 201);
  } catch (error) {
    return toResponse(error);
  }
}
