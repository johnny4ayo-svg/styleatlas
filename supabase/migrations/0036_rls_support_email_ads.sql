alter table support_tickets enable row level security;
alter table support_ticket_replies enable row level security;
alter table email_logs enable row level security;
alter table ad_placements enable row level security;

create policy "support_tickets_owner_select" on support_tickets
  for select using (user_id = current_profile_id() or is_admin());
create policy "support_tickets_owner_insert" on support_tickets
  for insert with check (user_id = current_profile_id() or user_id is null);
create policy "support_tickets_admin_update" on support_tickets
  for update using (is_admin()) with check (is_admin());

create policy "support_ticket_replies_select" on support_ticket_replies
  for select using (
    is_admin()
    or exists (select 1 from support_tickets t where t.id = ticket_id and t.user_id = current_profile_id())
  );
create policy "support_ticket_replies_insert" on support_ticket_replies
  for insert with check (
    author_id = current_profile_id()
    and (
      is_admin()
      or exists (select 1 from support_tickets t where t.id = ticket_id and t.user_id = current_profile_id())
    )
  );

-- Email logs are an internal deliverability record — admins only.
create policy "email_logs_admin_select" on email_logs
  for select using (is_admin());

create policy "ad_placements_public_read" on ad_placements
  for select using (status = 'active' or is_admin());
create policy "ad_placements_admin_write" on ad_placements
  for insert with check (is_admin());
create policy "ad_placements_admin_update" on ad_placements
  for update using (is_admin()) with check (is_admin());
create policy "ad_placements_admin_delete" on ad_placements
  for delete using (is_admin());
