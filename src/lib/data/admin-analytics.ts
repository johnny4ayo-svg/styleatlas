import { createClient } from "@/lib/supabase/server";

interface AdminOverviewStats {
  totalUsers: number;
  totalProfessionals: number;
  activePaidSubscribers: number;
  pendingApprovals: number;
  pendingVerifications: number;
  pendingReviews: number;
  openSupportTickets: number;
  openMarketplaceRequests: number;
  newLeads30d: number;
}

const EMPTY_STATS: AdminOverviewStats = {
  totalUsers: 0,
  totalProfessionals: 0,
  activePaidSubscribers: 0,
  pendingApprovals: 0,
  pendingVerifications: 0,
  pendingReviews: 0,
  openSupportTickets: 0,
  openMarketplaceRequests: 0,
  newLeads30d: 0,
};

/**
 * A single RPC round trip (see migration 0041) instead of 9 separate
 * count queries. RLS still applies exactly as before — the function is
 * security invoker, so it runs as the calling admin, not a privileged
 * role; this is purely a network-latency optimization.
 */
export async function getAdminOverviewStats(): Promise<AdminOverviewStats> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_admin_overview_stats");

  if (error || !data) {
    console.error("getAdminOverviewStats failed", error?.message);
    return EMPTY_STATS;
  }

  return { ...EMPTY_STATS, ...(data as Partial<AdminOverviewStats>) };
}
