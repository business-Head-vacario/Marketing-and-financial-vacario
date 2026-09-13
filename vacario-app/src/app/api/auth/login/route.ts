import { db } from "@/lib/db";
import { startSession, verifyPassword } from "@/lib/auth";
import { ok, toResponse, HttpError } from "@/lib/api";
import { loginSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const { identifier, password } = loginSchema.parse(await request.json());
    const key = identifier.toLowerCase();

    const user = await db.user.findFirst({
      where: { OR: [{ email: key }, { username: key }] },
      include: { agency: { select: { id: true } } },
    });
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      throw new HttpError("Those details don't match an account", 401);
    }

    await startSession(user);

    const next = !user.onboarded
      ? user.role === "AGENT" && !user.agency
        ? "/onboarding/agent"
        : "/onboarding"
      : user.role === "AGENT"
        ? "/dashboard"
        : "/";

    return ok({ user: { id: user.id, username: user.username, role: user.role }, next });
  } catch (error) {
    return toResponse(error);
  }
}
