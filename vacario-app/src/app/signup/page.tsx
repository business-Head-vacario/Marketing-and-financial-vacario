import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AuthLayout } from "@/components/forms/AuthLayout";
import { SignupForm } from "@/components/forms/AuthForms";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "Create your account" };

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  if (await getCurrentUser()) redirect("/");
  const { role } = await searchParams;
  return (
    <AuthLayout title="Create your account" subtitle="Two minutes, and your travel feed is live.">
      <Suspense fallback={null}>
        <SignupForm defaultRole={role === "agent" ? "AGENT" : "TRAVELLER"} />
      </Suspense>
    </AuthLayout>
  );
}
