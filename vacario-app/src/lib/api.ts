import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ZodError } from "zod";
import { db } from "./db";
import { SESSION_COOKIE, verifySession } from "./session";

export function ok<T>(data: T, init?: number) {
  return NextResponse.json(data, { status: init ?? 200 });
}

export function fail(message: string, status = 400, extra?: Record<string, unknown>) {
  return NextResponse.json({ error: message, ...extra }, { status });
}

export function handleError(error: unknown) {
  if (error instanceof ZodError) {
    const first = error.issues[0];
    return fail(first ? `${first.path.join(".") || "input"}: ${first.message}` : "Invalid input", 422, {
      issues: error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
    });
  }
  console.error("[api]", error);
  const message = error instanceof Error ? error.message : "Unexpected server error";
  return fail(message, 500);
}

/** Route-handler flavour of getCurrentUser: no redirects, just null when signed out. */
export async function sessionUser() {
  const jar = await cookies();
  const payload = await verifySession(jar.get(SESSION_COOKIE)?.value);
  if (!payload) return null;
  return db.user.findUnique({ where: { id: payload.sub }, include: { agency: true } });
}

export async function requireSessionUser() {
  const user = await sessionUser();
  if (!user) throw new HttpError("You need to sign in to do that", 401);
  return user;
}

export class HttpError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export function toResponse(error: unknown) {
  if (error instanceof HttpError) return fail(error.message, error.status);
  return handleError(error);
}
