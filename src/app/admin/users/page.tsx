import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default async function AdminUsersPage() {
  const supabase = createClient();
  const { data: users } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, status, city, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="overflow-hidden rounded-lg border border-charcoal-100 bg-white">
      <table className="w-full text-sm">
        <thead className="border-b border-charcoal-100 bg-charcoal-50 text-left text-xs uppercase tracking-wide text-charcoal-500">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">City</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Joined</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-charcoal-100">
          {(users ?? []).map((user) => (
            <tr key={user.id} className="hover:bg-charcoal-50/50">
              <td className="px-4 py-3 font-medium text-charcoal-900">{user.full_name || "—"}</td>
              <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
              <td className="px-4 py-3"><Badge variant="outline" className="capitalize">{user.role.replace("_", " ")}</Badge></td>
              <td className="px-4 py-3 text-muted-foreground">{user.city || "—"}</td>
              <td className="px-4 py-3">
                <Badge variant={user.status === "active" ? "success" : "destructive"} className="capitalize">{user.status}</Badge>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{formatDate(user.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
