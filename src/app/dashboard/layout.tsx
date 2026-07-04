import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/rbac";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireAuth();

  if (profile.role === "admin" || profile.role === "super_admin") {
    redirect("/admin");
  }

  const isProfessional = profile.role === "professional" || profile.role === "professional_staff";

  return (
    <DashboardShell nav={isProfessional ? "professional" : "customer"} title="Dashboard">
      {children}
    </DashboardShell>
  );
}
