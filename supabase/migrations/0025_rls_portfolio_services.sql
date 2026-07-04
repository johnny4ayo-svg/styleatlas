alter table services enable row level security;
alter table portfolio_items enable row level security;

create policy "services_public_read" on services
  for select using (
    status = 'active' or can_manage_professional_account(professional_account_id, 'profile_editing')
  );
create policy "services_owner_write" on services
  for insert with check (can_manage_professional_account(professional_account_id, 'profile_editing'));
create policy "services_owner_update" on services
  for update using (can_manage_professional_account(professional_account_id, 'profile_editing'))
  with check (can_manage_professional_account(professional_account_id, 'profile_editing'));
create policy "services_owner_delete" on services
  for delete using (can_manage_professional_account(professional_account_id, 'profile_editing'));

create policy "portfolio_items_public_read" on portfolio_items
  for select using (
    status = 'active' or can_manage_professional_account(professional_account_id, 'gallery')
  );
create policy "portfolio_items_owner_write" on portfolio_items
  for insert with check (
    can_manage_professional_account(professional_account_id, 'gallery')
    and can_add_portfolio_item(professional_account_id)
  );
create policy "portfolio_items_owner_update" on portfolio_items
  for update using (can_manage_professional_account(professional_account_id, 'gallery'))
  with check (can_manage_professional_account(professional_account_id, 'gallery'));
create policy "portfolio_items_owner_delete" on portfolio_items
  for delete using (can_manage_professional_account(professional_account_id, 'gallery'));
