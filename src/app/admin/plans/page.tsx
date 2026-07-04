import { getActivePlans } from "@/lib/data/plans";
import { PlanPricingEditor } from "@/components/admin/plan-pricing-editor";

export default async function AdminPlansPage() {
  const plans = await getActivePlans();
  return <PlanPricingEditor plans={plans} />;
}
