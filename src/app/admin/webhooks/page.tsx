import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate } from "@/lib/utils";

const STATUS_VARIANT: Record<string, "success" | "warning" | "destructive" | "outline"> = {
  processed: "success",
  received: "warning",
  failed: "destructive",
  ignored: "outline",
};

export default async function AdminWebhooksPage() {
  const supabase = createClient();
  const { data: events } = await supabase
    .from("webhook_events")
    .select("id, provider, event_type, status, error_message, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (!events || events.length === 0) {
    return <EmptyState title="No webhook events yet" description="Paystack and Flutterwave webhook deliveries will appear here." />;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-charcoal-100 bg-white">
      <table className="w-full text-sm">
        <thead className="border-b border-charcoal-100 bg-charcoal-50 text-left text-xs uppercase tracking-wide text-charcoal-500">
          <tr>
            <th className="px-4 py-3">Provider</th>
            <th className="px-4 py-3">Event Type</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Error</th>
            <th className="px-4 py-3">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-charcoal-100">
          {events.map((event) => (
            <tr key={event.id} className="hover:bg-charcoal-50/50">
              <td className="px-4 py-3 capitalize text-charcoal-700">{event.provider}</td>
              <td className="px-4 py-3 text-muted-foreground">{event.event_type}</td>
              <td className="px-4 py-3"><Badge variant={STATUS_VARIANT[event.status] ?? "outline"} className="capitalize">{event.status}</Badge></td>
              <td className="max-w-xs truncate px-4 py-3 text-xs text-destructive">{event.error_message ?? "—"}</td>
              <td className="px-4 py-3 text-muted-foreground">{formatDate(event.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
