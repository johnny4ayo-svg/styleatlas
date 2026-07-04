import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate } from "@/lib/utils";

export default async function AdminLeadsPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("leads")
    .select("id, name, email, source_type, status, city, created_at, professional_account:professional_accounts(business_name)")
    .order("created_at", { ascending: false })
    .limit(100);

  const leads = data as unknown as {
    id: string; name: string; email: string; source_type: string; status: string; city: string | null; created_at: string;
    professional_account: { business_name: string } | null;
  }[] | null;

  if (!leads || leads.length === 0) {
    return <EmptyState title="No leads yet" description="Platform-wide lead activity will appear here." />;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-charcoal-100 bg-white">
      <table className="w-full text-sm">
        <thead className="border-b border-charcoal-100 bg-charcoal-50 text-left text-xs uppercase tracking-wide text-charcoal-500">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Professional</th>
            <th className="px-4 py-3">Source</th>
            <th className="px-4 py-3">City</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-charcoal-100">
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-charcoal-50/50">
              <td className="px-4 py-3 font-medium text-charcoal-900">{lead.name}</td>
              <td className="px-4 py-3 text-muted-foreground">{lead.professional_account?.business_name ?? "—"}</td>
              <td className="px-4 py-3"><Badge variant="outline" className="capitalize">{lead.source_type.replace(/_/g, " ")}</Badge></td>
              <td className="px-4 py-3 text-muted-foreground">{lead.city ?? "—"}</td>
              <td className="px-4 py-3"><Badge variant="outline" className="capitalize">{lead.status}</Badge></td>
              <td className="px-4 py-3 text-muted-foreground">{formatDate(lead.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
