alter table professional_accounts enable row level security;
alter table professional_staff enable row level security;
alter table brand_profiles enable row level security;
alter table school_profiles enable row level security;

-- Public can read active listings. Owners/staff/admins can additionally
-- see their own draft/pending/suspended listings.
create policy "professional_accounts_public_read" on professional_accounts
  for select using (
    status = 'active'
    or is_admin()
    or owns_professional_account(id)
    or has_staff_permission(id, 'profile_editing')
  );

create policy "professional_accounts_owner_insert" on professional_accounts
  for insert with check (
    owner_id = current_profile_id()
    and current_role_name() in ('professional', 'admin', 'super_admin')
  );

create policy "professional_accounts_owner_update" on professional_accounts
  for update using (can_manage_professional_account(id, 'profile_editing'))
  with check (can_manage_professional_account(id, 'profile_editing'));

create policy "professional_accounts_admin_delete" on professional_accounts
  for delete using (is_admin());

-- Staff: only the owner or an admin can invite/manage staff rows. Staff
-- themselves may read their own membership row (to know their permissions).
create policy "professional_staff_read" on professional_staff
  for select using (
    is_admin()
    or owns_professional_account(professional_account_id)
    or user_id = current_profile_id()
  );

create policy "professional_staff_owner_write" on professional_staff
  for insert with check (is_admin() or owns_professional_account(professional_account_id));

create policy "professional_staff_owner_update" on professional_staff
  for update using (is_admin() or owns_professional_account(professional_account_id))
  with check (is_admin() or owns_professional_account(professional_account_id));

create policy "professional_staff_owner_delete" on professional_staff
  for delete using (is_admin() or owns_professional_account(professional_account_id));

-- brand_profiles / school_profiles follow the parent account's permissions.
create policy "brand_profiles_public_read" on brand_profiles
  for select using (true);
create policy "brand_profiles_owner_write" on brand_profiles
  for insert with check (can_manage_professional_account(professional_account_id, 'profile_editing'));
create policy "brand_profiles_owner_update" on brand_profiles
  for update using (can_manage_professional_account(professional_account_id, 'profile_editing'))
  with check (can_manage_professional_account(professional_account_id, 'profile_editing'));

create policy "school_profiles_public_read" on school_profiles
  for select using (true);
create policy "school_profiles_owner_write" on school_profiles
  for insert with check (can_manage_professional_account(professional_account_id, 'profile_editing'));
create policy "school_profiles_owner_update" on school_profiles
  for update using (can_manage_professional_account(professional_account_id, 'profile_editing'))
  with check (can_manage_professional_account(professional_account_id, 'profile_editing'));
