import { requireAuth } from "@/lib/auth/rbac";
import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatNaira } from "@/lib/utils";

export default async function DashboardRequestsPage() {
  const profile = await requireAuth();
  const supabase = createClient();

  const { data: requests } = await supabase
    .from("customer_requests")
    .select("*, category:categories(name), responses:request_responses(id, message, quote_min, quote_max, status, professional:professional_accounts(business_name, slug))")
    .eq("customer_id", profile.id)
    .order("created_at", { ascending: false });

  type RequestRow = {
    id: string; title: string; city: string; state: string; status: string; created_at: string;
    category?: { name: string };
    responses: { id: string; message: string; quote_min: number | null; quote_max: number | null; status: string; professional: { business_name: string; slug: string } }[];
  };

  const rows = (requests ?? []) as unknown as RequestRow[];

  if (rows.length === 0) {
    return <EmptyState title="No fashion requests yet" description="Submit a request and let matched professionals come to you." actionLabel="Submit a Request" actionHref="/marketplace" />;
  }

  return (
    <div className="space-y-6">
      {rows.map((request) => (
        <div key={request.id} className="rounded-lg border border-charcoal-100 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-serif text-lg font-semibold text-charcoal-900">{request.title}</p>
              <p className="text-xs text-muted-foreground">
                {request.category?.name} · {request.city}, {request.state} · {formatDate(request.created_at)}
              </p>
            </div>
            <Badge variant="outline" className="capitalize">{request.status}</Badge>
          </div>

          {request.responses.length > 0 ? (
            <div className="mt-4 space-y-2 border-t border-charcoal-100 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">{request.responses.length} Response(s)</p>
              {request.responses.map((response) => (
                <div key={response.id} className="rounded-md bg-ivory p-3">
                  <p className="text-sm font-medium text-charcoal-900">{response.professional?.business_name}</p>
                  <p className="mt-1 text-sm text-charcoal-700">{response.message}</p>
                  {response.quote_min && (
                    <p className="mt-1 text-sm font-medium text-gold-600">
                      {formatNaira(response.quote_min)}{response.quote_max ? ` – ${formatNaira(response.quote_max)}` : ""}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">No responses yet — we&apos;re still matching professionals.</p>
          )}
        </div>
      ))}
    </div>
  );
}
