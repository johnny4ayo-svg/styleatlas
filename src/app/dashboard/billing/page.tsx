import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/rbac";
import { getManagedProfessionalAccount } from "@/lib/data/dashboard";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate, formatNaira } from "@/lib/utils";

const STATUS_VARIANT: Record<string, "success" | "warning" | "destructive" | "outline"> = {
  active: "success",
  trialing: "success",
  past_due: "warning",
  canceled: "destructive",
  expired: "destructive",
  incomplete: "warning",
};

export default async function DashboardBillingPage() {
  const profile = await requireAuth();
  const account = await getManagedProfessionalAccount(profile.id);
  if (!account) redirect("/onboarding/professional");

  const supabase = createClient();
  const [{ data: subscription }, { data: transactions }] = await Promise.all([
    supabase
      .from("subscriptions")
      .select("*")
      .eq("professional_account_id", account.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("payment_transactions")
      .select("*")
      .eq("professional_account_id", account.id)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const sub = subscription as { status: string; billing_cycle: string; current_period_end: string; cancel_at_period_end: boolean } | null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Current Plan</CardTitle>
          <Button asChild size="sm">
            <Link href="/pricing">Change Plan</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Badge variant="gold" className="capitalize">{account.plan?.slug ?? "Free"} Plan</Badge>
            {sub && <Badge variant={STATUS_VARIANT[sub.status] ?? "outline"} className="capitalize">{sub.status.replace("_", " ")}</Badge>}
          </div>
          {sub && (
            <p className="mt-3 text-sm text-muted-foreground">
              {sub.cancel_at_period_end ? "Cancels" : "Renews"} on {formatDate(sub.current_period_end)} · Billed {sub.billing_cycle}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Payment History</CardTitle></CardHeader>
        <CardContent>
          {!transactions || transactions.length === 0 ? (
            <EmptyState title="No transactions yet" description="Your payment history will appear here once you upgrade to a paid plan." />
          ) : (
            <div className="overflow-hidden rounded-lg border border-charcoal-100">
              <table className="w-full text-sm">
                <thead className="border-b border-charcoal-100 bg-charcoal-50 text-left text-xs uppercase tracking-wide text-charcoal-500">
                  <tr>
                    <th className="px-4 py-2.5">Date</th>
                    <th className="px-4 py-2.5">Provider</th>
                    <th className="px-4 py-2.5">Amount</th>
                    <th className="px-4 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal-100">
                  {(transactions as unknown as { id: string; created_at: string; provider: string; amount: number; currency: string; status: string }[]).map((tx) => (
                    <tr key={tx.id}>
                      <td className="px-4 py-2.5 text-muted-foreground">{formatDate(tx.created_at)}</td>
                      <td className="px-4 py-2.5 capitalize text-charcoal-700">{tx.provider}</td>
                      <td className="px-4 py-2.5 text-charcoal-700">{formatNaira(tx.amount)}</td>
                      <td className="px-4 py-2.5">
                        <Badge variant={tx.status === "success" ? "success" : tx.status === "failed" ? "destructive" : "outline"} className="capitalize">
                          {tx.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
