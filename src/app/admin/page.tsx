import { Users, Building2, CreditCard, ShieldCheck, MessageSquareWarning, LifeBuoy, ShoppingBag, Star } from "lucide-react";
import { getAdminOverviewStats } from "@/lib/data/admin-analytics";
import { AnalyticsCard } from "@/components/dashboard/analytics-card";

export default async function AdminOverviewPage() {
  const stats = await getAdminOverviewStats();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnalyticsCard label="Total Users" value={stats.totalUsers} icon={Users} href="/admin/users" />
        <AnalyticsCard label="Professionals" value={stats.totalProfessionals} icon={Building2} accent="emerald" href="/admin/professionals" />
        <AnalyticsCard label="Active Paid Subscribers" value={stats.activePaidSubscribers} icon={CreditCard} accent="gold" href="/admin/plans" />
        <AnalyticsCard label="New Leads (30d)" value={stats.newLeads30d} icon={Star} accent="burgundy" href="/admin/leads" />
      </div>

      <div>
        <h2 className="mb-4 font-serif text-xl font-semibold text-charcoal-900">Needs Attention</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AnalyticsCard label="Listing Approvals Pending" value={stats.pendingApprovals} icon={ShieldCheck} accent="charcoal" href="/admin/approvals" />
          <AnalyticsCard label="Verification Requests Pending" value={stats.pendingVerifications} icon={ShieldCheck} accent="charcoal" href="/admin/verification" />
          <AnalyticsCard label="Reviews Pending Moderation" value={stats.pendingReviews} icon={MessageSquareWarning} accent="charcoal" href="/admin/reviews" />
          <AnalyticsCard label="Open Support Tickets" value={stats.openSupportTickets} icon={LifeBuoy} accent="charcoal" href="/admin/support" />
          <AnalyticsCard label="Open Marketplace Requests" value={stats.openMarketplaceRequests} icon={ShoppingBag} accent="charcoal" href="/admin/requests" />
        </div>
      </div>
    </div>
  );
}
