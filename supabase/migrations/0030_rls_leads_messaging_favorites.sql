alter table leads enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;
alter table favorites enable row level security;

-- Leads: professionals/staff with 'leads' permission see leads assigned to
-- their account; admins see everything. Public (including anonymous
-- visitors) may INSERT a lead — that's how contact forms, WhatsApp click
-- attribution, and AI chat handoffs create leads — but may never read
-- back the table.
create policy "leads_select" on leads
  for select using (
    is_admin()
    or (professional_account_id is not null and can_manage_professional_account(professional_account_id, 'leads'))
    or customer_id = current_profile_id()
  );

create policy "leads_public_insert" on leads
  for insert with check (true);

create policy "leads_professional_update_status" on leads
  for update using (
    is_admin()
    or (professional_account_id is not null and can_manage_professional_account(professional_account_id, 'leads'))
  )
  with check (
    is_admin()
    or (professional_account_id is not null and can_manage_professional_account(professional_account_id, 'leads'))
  );

-- Conversations/messages: only the two participants (customer + the
-- professional account's owner/staff with 'messages' permission).
create policy "conversations_select" on conversations
  for select using (
    customer_id = current_profile_id()
    or can_manage_professional_account(professional_account_id, 'messages')
    or is_admin()
  );

create policy "conversations_insert" on conversations
  for insert with check (
    customer_id = current_profile_id()
    or can_manage_professional_account(professional_account_id, 'messages')
  );

create policy "messages_select" on messages
  for select using (
    exists (
      select 1 from conversations c
      where c.id = messages.conversation_id
        and (c.customer_id = current_profile_id() or can_manage_professional_account(c.professional_account_id, 'messages'))
    )
    or is_admin()
  );

create policy "messages_insert" on messages
  for insert with check (
    sender_id = current_profile_id()
    and exists (
      select 1 from conversations c
      where c.id = conversation_id
        and (c.customer_id = current_profile_id() or can_manage_professional_account(c.professional_account_id, 'messages'))
    )
  );

create policy "messages_mark_read" on messages
  for update using (receiver_id = current_profile_id())
  with check (receiver_id = current_profile_id());

-- Favorites are strictly owner-only.
create policy "favorites_owner_all_select" on favorites
  for select using (user_id = current_profile_id());
create policy "favorites_owner_insert" on favorites
  for insert with check (user_id = current_profile_id());
create policy "favorites_owner_delete" on favorites
  for delete using (user_id = current_profile_id());
