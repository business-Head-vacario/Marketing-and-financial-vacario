import { db } from "./db";

type NotifyInput = {
  userId: string;
  actorId?: string | null;
  type: "LIKE" | "COMMENT" | "FOLLOW" | "BOOKING" | "BOOKING_STATUS" | "AGENCY_STATUS";
  message: string;
  href?: string;
};

/** Fire-and-forget notification; never let it break the request that triggered it. */
export async function notify({ userId, actorId, type, message, href }: NotifyInput) {
  if (actorId && actorId === userId) return; // don't notify yourself
  try {
    await db.notification.create({ data: { userId, actorId: actorId ?? null, type, message, href } });
  } catch (error) {
    console.error("[notify]", error);
  }
}
