"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlanCheckoutButton } from "@/components/pricing/plan-checkout-button";
import { formatNaira, cn } from "@/lib/utils";
import type { SubscriptionPlan, BillingCycle } from "@/types";

export function PricingSection({ plans }: { plans: SubscriptionPlan[] }) {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  return (
    <div>
      <div className="mb-10 flex items-center justify-center gap-3">
        <span className={cn("text-sm font-medium", billingCycle === "monthly" ? "text-charcoal-900" : "text-muted-foreground")}>Monthly</span>
        <button
          onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
          className="relative h-7 w-14 rounded-full bg-charcoal-200 transition-colors data-[on=true]:bg-gold-400"
          data-on={billingCycle === "yearly"}
        >
          <span
            className={cn(
              "absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform",
              billingCycle === "yearly" ? "translate-x-8" : "translate-x-1"
            )}
          />
        </button>
        <span className={cn("text-sm font-medium", billingCycle === "yearly" ? "text-charcoal-900" : "text-muted-foreground")}>
          Yearly <Badge variant="emerald" className="ml-1">Save up to 20%</Badge>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => {
          const price = billingCycle === "monthly" ? plan.monthly_price : plan.yearly_price;
          const isElite = plan.slug === "elite";

          return (
            <Card
              key={plan.id}
              className={cn("relative flex flex-col", isElite && "border-gold-400 shadow-gold ring-1 ring-gold-300")}
            >
              {plan.badge && (
                <Badge variant="premium" className="absolute -top-3 left-1/2 -translate-x-1/2">
                  {plan.badge}
                </Badge>
              )}
              <CardHeader>
                <h3 className="font-serif text-xl font-semibold text-charcoal-900">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
                <div className="mt-4">
                  <span className="font-serif text-3xl font-semibold text-charcoal-900">
                    {price === 0 ? "Free" : formatNaira(price)}
                  </span>
                  {price > 0 && <span className="text-sm text-muted-foreground">/{billingCycle === "monthly" ? "mo" : "yr"}</span>}
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <ul className="mb-6 flex-1 space-y-2.5">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-charcoal-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <PlanCheckoutButton
                  planSlug={plan.slug}
                  billingCycle={billingCycle}
                  label={plan.slug === "free" ? "Get Started Free" : `Choose ${plan.name}`}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
