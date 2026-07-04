alter table seo_pages enable row level security;
alter table redirects enable row level security;
alter table notifications enable row level security;

create policy "seo_pages_public_read" on seo_pages
  for select using (status = 'active' or is_admin());
create policy "seo_pages_admin_write" on seo_pages
  for insert with check (is_admin());
create policy "seo_pages_admin_update" on seo_pages
  for update using (is_admin()) with check (is_admin());
create policy "seo_pages_admin_delete" on seo_pages
  for delete using (is_admin());

-- Redirects are consumed by Next.js middleware server-side; no need to
-- expose them to anonymous clients at all.
create policy "redirects_admin_only" on redirects
  for select using (is_admin());
create policy "redirects_admin_write" on redirects
  for insert with check (is_admin());
create policy "redirects_admin_delete" on redirects
  for delete using (is_admin());

create policy "notifications_owner_select" on notifications
  for select using (user_id = current_profile_id());
create policy "notifications_owner_update" on notifications
  for update using (user_id = current_profile_id()) with check (user_id = current_profile_id());
