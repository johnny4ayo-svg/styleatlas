-- Consolidates the admin overview page's 9 separate count queries into a
-- single round trip. Each COUNT is computed server-side in one query
-- plan instead of 9 separate HTTP requests to PostgREST — same total
-- database work, far less network overhead.
create or replace function get_admin_overview_stats()
returns jsonb
language sql
stable
security invoker
as $$
  select jsonb_build_object(
    'totalUsers', (select count(*) from profiles),
    'totalProfessionals', (select count(*) from professional_accounts),
    'activePaidSubscribers', (select count(*) from subscriptions where status = 'active'),
    'pendingApprovals', (select count(*) from professional_accounts where status = 'pending'),
    'pendingVerifications', (select count(*) from verification_requests where status = 'pending'),
    'pendingReviews', (select count(*) from reviews where status = 'pending'),
    'openSupportTickets', (select count(*) from support_tickets where status = 'open'),
    'openMarketplaceRequests', (select count(*) from customer_requests where status = 'open'),
    'newLeads30d', (select count(*) from leads where created_at >= now() - interval '30 days')
  );
$$;

comment on function get_admin_overview_stats is
  'security invoker (not definer): runs as the calling admin, so the existing is_admin()-gated RLS select policies on each underlying table still apply — this is purely a network-round-trip optimization, not a privilege change.';
