"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updatePlanPricing } from "@/lib/actions/admin-plans";
import type { SubscriptionPlan } from "@/types";

function PlanRow({ plan }: { plan: SubscriptionPlan }) {
  const [monthly, setMonthly] = useState(plan.monthly_price);
  const [yearly, setYearly] = useState(plan.yearly_price);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const result = await updatePlanPricing(plan.id, monthly, yearly);
    setSaving(false);
    if (result.error) toast.error("Couldn't save pricing.");
    else toast.success(`${plan.name} pricing updated.`);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-charcoal-100 bg-white p-4">
      <div className="w-32 font-medium text-charcoal-900">{plan.name}</div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Monthly ₦</span>
        <Input type="number" value={monthly} onChange={(e) => setMonthly(Number(e.target.value))} className="h-9 w-32" />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Yearly ₦</span>
        <Input type="number" value={yearly} onChange={(e) => setYearly(Number(e.target.value))} className="h-9 w-32" />
      </div>
      <Button size="sm" onClick={handleSave} disabled={saving}>
        {saving ? "Saving…" : "Save"}
      </Button>
    </div>
  );
}

export function PlanPricingEditor({ plans }: { plans: SubscriptionPlan[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Plan Pricing</CardTitle>
        <p className="text-xs text-muted-foreground">
          Prices here are the single source of truth — the pricing page and payment checkout always read from this table.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {plans.map((plan) => (
          <PlanRow key={plan.id} plan={plan} />
        ))}
      </CardContent>
    </Card>
  );
}
