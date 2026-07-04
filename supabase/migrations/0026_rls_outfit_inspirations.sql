alter table outfit_inspirations enable row level security;

create policy "outfit_inspirations_public_read" on outfit_inspirations
  for select using (
    status = 'active'
    or is_admin()
    or (designer_id is not null and can_manage_professional_account(designer_id, 'gallery'))
  );

-- Designers can submit inspiration tied to their own account; admins can
-- create/manage any. New submissions default to 'pending' and require
-- admin approval before becoming publicly visible.
create policy "outfit_inspirations_owner_insert" on outfit_inspirations
  for insert with check (
    is_admin()
    or (designer_id is not null and can_manage_professional_account(designer_id, 'gallery'))
  );

create policy "outfit_inspirations_owner_update" on outfit_inspirations
  for update using (
    is_admin()
    or (designer_id is not null and can_manage_professional_account(designer_id, 'gallery'))
  )
  with check (
    is_admin()
    or (designer_id is not null and can_manage_professional_account(designer_id, 'gallery'))
  );

create policy "outfit_inspirations_admin_delete" on outfit_inspirations
  for delete using (is_admin());
