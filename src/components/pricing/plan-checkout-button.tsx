"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import type { PlanSlug, BillingCycle } from "@/types";

export function PlanCheckoutButton({
  planSlug,
  billingCycle,
  label,
}: {
  planSlug: PlanSlug;
  billingCycle: BillingCycle;
  label: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<"paystack" | "flutterwave" | null>(null);

  const startCheckout = async (provider: "paystack" | "flutterwave") => {
    setLoading(provider);
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push(`/register?type=professional&plan=${planSlug}`);
      return;
    }

    try {
      // Plan, price, and permissions are re-validated server-side inside
      // this Edge Function against subscription_plans — the client only
      // states intent.
      const { data, error } = await supabase.functions.invoke("create-payment-checkout", {
        body: { plan_slug: planSlug, billing_cycle: billingCycle, provider },
      });

      if (error || !data?.checkoutUrl) throw error ?? new Error("No checkout URL returned");
      window.location.href = data.checkoutUrl;
    } catch {
      toast.error("Couldn't start checkout. Please try again.");
      setLoading(null);
    }
  };

  if (planSlug === "free") {
    return (
      <Button className="w-full" onClick={() => router.push("/register?type=professional")}>
        {label}
      </Button>
    );
  }

  return (
    <>
      <Button className="w-full" onClick={() => setOpen(true)}>
        {label}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Choose a payment method</DialogTitle>
            <DialogDescription>Secure checkout powered by Paystack or Flutterwave.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Button className="w-full" disabled={!!loading} onClick={() => startCheckout("paystack")}>
              {loading === "paystack" ? "Redirecting…" : "Pay with Paystack"}
            </Button>
            <Button variant="secondary" className="w-full" disabled={!!loading} onClick={() => startCheckout("flutterwave")}>
              {loading === "flutterwave" ? "Redirecting…" : "Pay with Flutterwave"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
