import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";

export default async function SavedRedirect() {
  const user = await requireUser("/login?next=/saved");
  redirect(`/u/${user.username}?tab=saved`);
}
