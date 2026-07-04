alter table subscription_plans enable row level security;
alter table subscriptions enable row level security;
alter table payment_transactions enable row level security;
alter table webhook_events enable row level security;
alter table featured_placements enable row level security;
alter table subscription_overrides enable row level security;

-- Plans power the public pricing page.
create policy "subscription_plans_public_read" on subscription_plans
  for select using (status = 'active' or is_admin());
create policy "subscription_plans_admin_write" on subscription_plans
  for insert with check (is_admin());
create policy "subscription_plans_admin_update" on subscription_plans
  for update using (is_admin()) with check (is_admin());

-- Subscriptions/payment_transactions: read-only for the owner and admins.
-- All writes happen exclusively through Edge Functions using the service
-- role (create-payment-checkout, paystack-webhook, flutterwave-webhook,
-- subscription-sync) — no insert/update policy exists for anon/authenticated,
-- so any attempt from the browser is rejected by default-deny RLS.
create policy "subscriptions_select" on subscriptions
  for select using (
    user_id = current_profile_id()
    or (professional_account_id is not null and can_manage_professional_account(professional_account_id, 'billing_read_only'))
    or is_admin()
  );

create policy "payment_transactions_select" on payment_transactions
  for select using (
    user_id = current_profile_id()
    or (professional_account_id is not null and can_manage_professional_account(professional_account_id, 'billing_read_only'))
    or is_admin()
  );

-- webhook_events is never exposed to end users, even the account owner —
-- it may contain raw provider payloads. Admins only.
create policy "webhook_events_admin_select" on webhook_events
  for select using (is_admin());

create policy "featured_placements_public_read" on featured_placements
  for select using (status = 'active' or is_admin());
create policy "featured_placements_admin_write" on featured_placements
  for insert with check (is_admin());
create policy "featured_placements_admin_update" on featured_placements
  for update using (is_admin()) with check (is_admin());
create policy "featured_placements_admin_delete" on featured_placements
  for delete using (is_admin());

-- Every manual override must be visible to admins/super admins for audit,
-- and to the affected account owner (read-only, billing transparency).
create policy "subscription_overrides_select" on subscription_overrides
  for select using (
    is_admin()
    or exists (
      select 1 from subscriptions s
      where s.id = subscription_overrides.subscription_id and s.user_id = current_profile_id()
    )
  );

create policy "subscription_overrides_admin_insert" on subscription_overrides
  for insert with check (is_admin() and performed_by = current_profile_id());
