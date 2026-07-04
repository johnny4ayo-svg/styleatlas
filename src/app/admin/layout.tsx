import { requireRole } from "@/lib/auth/rbac";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole("admin", "super_admin");

  return (
    <DashboardShell nav="admin" title="Admin Console">
      {children}
    </DashboardShell>
  );
}
