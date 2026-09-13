import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AuthLayout } from "@/components/forms/AuthLayout";
import { LoginForm } from "@/components/forms/AuthForms";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "Log in" };

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/");
  return (
    <AuthLayout title="Welcome back" subtitle="Pick up where your last trip left off.">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
