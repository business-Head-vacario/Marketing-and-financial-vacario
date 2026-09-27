import { db } from "@/lib/db";
import { ok, toResponse, requireSessionUser } from "@/lib/api";

export async function POST() {
  try {
    const user = await requireSessionUser();
    await db.notification.updateMany({ where: { userId: user.id, read: false }, data: { read: true } });
    return ok({ read: true });
  } catch (error) {
    return toResponse(error);
  }
}
