import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate } from "@/lib/utils";

export default async function AdminAuditLogsPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("audit_logs")
    .select("id, action, entity_type, entity_id, created_at, actor:profiles(full_name)")
    .order("created_at", { ascending: false })
    .limit(150);

  const logs = data as unknown as {
    id: string; action: string; entity_type: string; entity_id: string | null; created_at: string;
    actor: { full_name: string } | null;
  }[] | null;

  if (!logs || logs.length === 0) {
    return <EmptyState title="No audit log entries yet" description="Admin actions like approvals, moderation, and billing overrides will appear here." />;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-charcoal-100 bg-white">
      <table className="w-full text-sm">
        <thead className="border-b border-charcoal-100 bg-charcoal-50 text-left text-xs uppercase tracking-wide text-charcoal-500">
          <tr>
            <th className="px-4 py-3">Actor</th>
            <th className="px-4 py-3">Action</th>
            <th className="px-4 py-3">Entity</th>
            <th className="px-4 py-3">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-charcoal-100">
          {logs.map((log) => (
            <tr key={log.id} className="hover:bg-charcoal-50/50">
              <td className="px-4 py-3 font-medium text-charcoal-900">{log.actor?.full_name ?? "System"}</td>
              <td className="px-4 py-3 text-muted-foreground">{log.action}</td>
              <td className="px-4 py-3 font-mono text-xs text-charcoal-500">{log.entity_type} · {log.entity_id?.slice(0, 8)}</td>
              <td className="px-4 py-3 text-muted-foreground">{formatDate(log.created_at, { dateStyle: "medium", timeStyle: "short" })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
