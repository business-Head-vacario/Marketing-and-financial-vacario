import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { SESSION_COOKIE, signSession, verifySession, sessionCookieOptions } from "./session";

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export async function startSession(user: { id: string; username: string; role: string }) {
  const token = await signSession({ sub: user.id, username: user.username, role: user.role });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, sessionCookieOptions);
}

export async function endSession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

/** The signed-in user with the relations every page header needs, or null. */
export async function getCurrentUser() {
  const jar = await cookies();
  const payload = await verifySession(jar.get(SESSION_COOKIE)?.value);
  if (!payload) return null;
  return db.user.findUnique({
    where: { id: payload.sub },
    include: {
      agency: { select: { id: true, name: true, slug: true, status: true, logoUrl: true } },
      _count: { select: { posts: true, followers: true, following: true } },
    },
  });
}

export type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

export async function requireUser(redirectTo = "/login") {
  const user = await getCurrentUser();
  if (!user) redirect(redirectTo);
  return user;
}

export async function requireAgency() {
  const user = await requireUser("/login?next=/dashboard");
  if (!user.agency) redirect("/onboarding/agent");
  return { user, agency: user.agency };
}

export async function requireAdmin() {
  const user = await requireUser("/login?next=/admin");
  if (user.role !== "ADMIN") redirect("/");
  return user;
}
