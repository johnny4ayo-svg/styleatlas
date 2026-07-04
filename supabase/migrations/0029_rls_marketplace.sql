alter table customer_requests enable row level security;
alter table request_responses enable row level security;
alter table request_matches enable row level security;

-- Customers manage their own requests. Professionals may see open
-- requests matched to them (via request_matches) so they can respond.
create policy "customer_requests_select" on customer_requests
  for select using (
    customer_id = current_profile_id()
    or is_admin()
    or exists (
      select 1 from request_matches rm
      where rm.request_id = customer_requests.id
        and can_manage_professional_account(rm.professional_account_id, 'leads')
    )
  );

create policy "customer_requests_insert" on customer_requests
  for insert with check (customer_id = current_profile_id());

create policy "customer_requests_update_own" on customer_requests
  for update using (customer_id = current_profile_id() or is_admin())
  with check (customer_id = current_profile_id() or is_admin());

create policy "request_responses_select" on request_responses
  for select using (
    can_manage_professional_account(professional_account_id, 'leads')
    or is_admin()
    or exists (select 1 from customer_requests cr where cr.id = request_id and cr.customer_id = current_profile_id())
  );

create policy "request_responses_professional_insert" on request_responses
  for insert with check (can_manage_professional_account(professional_account_id, 'leads'));

create policy "request_responses_professional_update" on request_responses
  for update using (can_manage_professional_account(professional_account_id, 'leads'))
  with check (can_manage_professional_account(professional_account_id, 'leads'));

-- request_matches is written by the lead-matching Edge Function (service
-- role only); professionals/customers may read rows relevant to them.
create policy "request_matches_select" on request_matches
  for select using (
    can_manage_professional_account(professional_account_id, 'leads')
    or is_admin()
    or exists (select 1 from customer_requests cr where cr.id = request_id and cr.customer_id = current_profile_id())
  );
