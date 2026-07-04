import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate, formatNaira } from "@/lib/utils";

const STATUS_VARIANT: Record<string, "success" | "warning" | "destructive" | "outline"> = {
  success: "success",
  pending: "warning",
  failed: "destructive",
  refunded: "outline",
};

export default async function AdminTransactionsPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("payment_transactions")
    .select("id, reference, provider, amount, currency, status, created_at, professional_account:professional_accounts(business_name)")
    .order("created_at", { ascending: false })
    .limit(100);

  const transactions = data as unknown as {
    id: string; reference: string; provider: string; amount: number; currency: string; status: string; created_at: string;
    professional_account: { business_name: string } | null;
  }[] | null;

  if (!transactions || transactions.length === 0) {
    return <EmptyState title="No transactions yet" description="Payment transactions will appear here once professionals subscribe to paid plans." />;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-charcoal-100 bg-white">
      <table className="w-full text-sm">
        <thead className="border-b border-charcoal-100 bg-charcoal-50 text-left text-xs uppercase tracking-wide text-charcoal-500">
          <tr>
            <th className="px-4 py-3">Reference</th>
            <th className="px-4 py-3">Business</th>
            <th className="px-4 py-3">Provider</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-charcoal-100">
          {transactions.map((tx) => (
            <tr key={tx.id} className="hover:bg-charcoal-50/50">
              <td className="px-4 py-3 font-mono text-xs text-charcoal-700">{tx.reference}</td>
              <td className="px-4 py-3 text-muted-foreground">{tx.professional_account?.business_name ?? "—"}</td>
              <td className="px-4 py-3 capitalize text-charcoal-700">{tx.provider}</td>
              <td className="px-4 py-3 text-charcoal-700">{formatNaira(tx.amount)}</td>
              <td className="px-4 py-3"><Badge variant={STATUS_VARIANT[tx.status] ?? "outline"} className="capitalize">{tx.status}</Badge></td>
              <td className="px-4 py-3 text-muted-foreground">{formatDate(tx.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
