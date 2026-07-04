alter table profiles enable row level security;
alter table categories enable row level security;
alter table specialties enable row level security;
alter table professional_specialties enable row level security;

-- profiles: users read/update their own row; admins read/manage all.
create policy "profiles_select_own_or_admin" on profiles
  for select using (auth_user_id = auth.uid() or is_admin());

create policy "profiles_update_own" on profiles
  for update using (auth_user_id = auth.uid()) with check (auth_user_id = auth.uid());

create policy "profiles_update_admin" on profiles
  for update using (is_admin()) with check (is_admin());

-- Public-facing display names for review authorship etc. are exposed via
-- a narrow view (public_profile_snippets), not the full profiles table.
create view public_profile_snippets as
  select id, full_name, avatar_url from profiles where status = 'active';
grant select on public_profile_snippets to anon, authenticated;

-- categories & specialties: public read for active rows, admin-only writes.
create policy "categories_public_read" on categories
  for select using (status = 'active' or is_admin());

create policy "categories_admin_write" on categories
  for insert with check (is_admin());
create policy "categories_admin_update" on categories
  for update using (is_admin()) with check (is_admin());
create policy "categories_admin_delete" on categories
  for delete using (is_admin());

create policy "specialties_public_read" on specialties
  for select using (status = 'active' or is_admin());
create policy "specialties_admin_write" on specialties
  for insert with check (is_admin());
create policy "specialties_admin_update" on specialties
  for update using (is_admin()) with check (is_admin());
create policy "specialties_admin_delete" on specialties
  for delete using (is_admin());

create policy "professional_specialties_public_read" on professional_specialties
  for select using (true);
create policy "professional_specialties_owner_write" on professional_specialties
  for insert with check (can_manage_professional_account(professional_account_id, 'profile_editing'));
create policy "professional_specialties_owner_delete" on professional_specialties
  for delete using (can_manage_professional_account(professional_account_id, 'profile_editing'));
