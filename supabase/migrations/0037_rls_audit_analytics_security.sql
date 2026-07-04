alter table audit_logs enable row level security;
alter table analytics_events enable row level security;
alter table security_logs enable row level security;
alter table feature_flags enable row level security;
alter table platform_settings enable row level security;
alter table rate_limit_events enable row level security;

-- Audit logs: admins read all; super admin-only actions are still just
-- rows here, readable by any admin for transparency, written only via
-- trusted server code (Edge Functions / server actions using the admin
-- client) after re-checking the actor's role.
create policy "audit_logs_admin_select" on audit_logs
  for select using (is_admin());

-- analytics_events: public/anon may INSERT (anonymous engagement
-- tracking), but only the account owner/staff with 'analytics' permission
-- or admins may read it back.
create policy "analytics_events_public_insert" on analytics_events
  for insert with check (true);

create policy "analytics_events_select" on analytics_events
  for select using (
    is_admin()
    or (professional_account_id is not null and can_manage_professional_account(professional_account_id, 'analytics'))
  );

-- Security logs are super-admin only.
create policy "security_logs_super_admin_select" on security_logs
  for select using (is_super_admin());

create policy "feature_flags_public_read_enabled" on feature_flags
  for select using (enabled or is_super_admin());
create policy "feature_flags_super_admin_write" on feature_flags
  for insert with check (is_super_admin());
create policy "feature_flags_super_admin_update" on feature_flags
  for update using (is_super_admin()) with check (is_super_admin());

create policy "platform_settings_super_admin_all" on platform_settings
  for select using (is_super_admin());
create policy "platform_settings_super_admin_write" on platform_settings
  for insert with check (is_super_admin());
create policy "platform_settings_super_admin_update" on platform_settings
  for update using (is_super_admin()) with check (is_super_admin());

-- rate_limit_events is written exclusively via the check_rate_limit()
-- SECURITY DEFINER function; no direct table access for anyone.
create policy "rate_limit_events_admin_select" on rate_limit_events
  for select using (is_admin());
