import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { VerifiedBadge } from "@/components/shared/verified-badge";

const STATUS_VARIANT: Record<string, "success" | "warning" | "destructive" | "outline"> = {
  active: "success",
  pending: "warning",
  suspended: "destructive",
  rejected: "destructive",
  draft: "outline",
};

export default async function AdminProfessionalsPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("professional_accounts")
    .select("id, business_name, slug, city, state, status, verification_status, category:categories(name), plan:subscription_plans(slug)")
    .order("created_at", { ascending: false })
    .limit(100);

  const professionals = data as unknown as {
    id: string; business_name: string; slug: string; city: string; state: string; status: string;
    verification_status: import("@/types").VerificationLevel;
    category: { name: string } | null;
    plan: { slug: string } | null;
  }[] | null;

  return (
    <div className="overflow-hidden rounded-lg border border-charcoal-100 bg-white">
      <table className="w-full text-sm">
        <thead className="border-b border-charcoal-100 bg-charcoal-50 text-left text-xs uppercase tracking-wide text-charcoal-500">
          <tr>
            <th className="px-4 py-3">Business</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Location</th>
            <th className="px-4 py-3">Plan</th>
            <th className="px-4 py-3">Verification</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-charcoal-100">
          {(professionals ?? []).map((p) => (
            <tr key={p.id} className="hover:bg-charcoal-50/50">
              <td className="px-4 py-3">
                <Link href={`/designers/${p.slug}`} target="_blank" className="font-medium text-charcoal-900 hover:text-gold-600">
                  {p.business_name}
                </Link>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{p.category?.name}</td>
              <td className="px-4 py-3 text-muted-foreground">{p.city}, {p.state}</td>
              <td className="px-4 py-3"><Badge variant="outline" className="capitalize">{p.plan?.slug ?? "free"}</Badge></td>
              <td className="px-4 py-3"><VerifiedBadge level={p.verification_status} /></td>
              <td className="px-4 py-3">
                <Badge variant={STATUS_VARIANT[p.status] ?? "outline"} className="capitalize">{p.status}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
