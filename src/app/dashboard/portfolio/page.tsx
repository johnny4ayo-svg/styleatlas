import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/rbac";
import { getManagedProfessionalAccount } from "@/lib/data/dashboard";
import { getPortfolioItems } from "@/lib/data/profile-detail";
import { PortfolioManager } from "@/components/dashboard/portfolio-manager";

export default async function DashboardPortfolioPage() {
  const profile = await requireAuth();
  const account = await getManagedProfessionalAccount(profile.id);
  if (!account) redirect("/onboarding/professional");

  const items = await getPortfolioItems(account.id);

  return <PortfolioManager accountId={account.id} items={items} />;
}
