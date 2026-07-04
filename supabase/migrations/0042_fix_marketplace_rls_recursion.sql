-- SECURITY/PERF FIX: customer_requests_select and request_matches_select
-- each queried the other table directly inside their USING clause,
-- forming a policy cycle: reading customer_requests evaluates the
-- request_matches policy, which evaluates the customer_requests policy,
-- and so on. Postgres detects this and aborts with "infinite recursion
-- detected in policy for relation customer_requests" — the query never
-- succeeds at all (this was silently swallowed by application-level
-- try/catch, which is why it went unnoticed rather than crashing pages,
-- but every marketplace-request read was failing).
--
-- Fix: route the cross-table check through a SECURITY DEFINER function.
-- Like is_admin() / owns_professional_account() elsewhere, this runs as
-- the function owner and so bypasses RLS on customer_requests when
-- called from request_matches'/request_responses' policies, which
-- breaks the cycle without changing who can see what.
create or replace function customer_owns_request(p_request_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from customer_requests cr
    where cr.id = p_request_id and cr.customer_id = current_profile_id()
  );
$$;

-- customer_requests_select (migration 0029) is unchanged and still reads
-- request_matches directly — only one side of the pair needs to change
-- to break the cycle, so request_matches'/request_responses' policies
-- below are rewritten to stop reading customer_requests directly.
drop policy if exists "request_matches_select" on request_matches;
create policy "request_matches_select" on request_matches
  for select using (
    can_manage_professional_account(professional_account_id, 'leads')
    or is_admin()
    or customer_owns_request(request_id)
  );

drop policy if exists "request_responses_select" on request_responses;
create policy "request_responses_select" on request_responses
  for select using (
    can_manage_professional_account(professional_account_id, 'leads')
    or is_admin()
    or customer_owns_request(request_id)
  );
