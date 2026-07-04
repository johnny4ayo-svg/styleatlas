alter table ai_chat_sessions enable row level security;
alter table ai_chat_messages enable row level security;
alter table ai_knowledge_base enable row level security;
alter table ai_chat_settings enable row level security;

-- Chat sessions may belong to a signed-in user OR an anonymous visitor
-- (tracked by visitor_id, a client-generated UUID stored in a cookie).
-- Anonymous session ownership can't be verified by auth.uid(), so reads/
-- writes for anonymous sessions are brokered entirely by the ai-live-chat
-- Edge Function (service role) rather than directly by the browser.
create policy "ai_chat_sessions_owner_select" on ai_chat_sessions
  for select using (user_id = current_profile_id() or is_admin());

create policy "ai_chat_messages_owner_select" on ai_chat_messages
  for select using (
    is_admin()
    or exists (
      select 1 from ai_chat_sessions s where s.id = session_id and s.user_id = current_profile_id()
    )
  );

create policy "ai_knowledge_base_admin_read" on ai_knowledge_base
  for select using (is_admin());
create policy "ai_knowledge_base_admin_write" on ai_knowledge_base
  for insert with check (is_admin());
create policy "ai_knowledge_base_admin_update" on ai_knowledge_base
  for update using (is_admin()) with check (is_admin());
create policy "ai_knowledge_base_admin_delete" on ai_knowledge_base
  for delete using (is_admin());

create policy "ai_chat_settings_admin_read" on ai_chat_settings
  for select using (is_admin());
create policy "ai_chat_settings_admin_update" on ai_chat_settings
  for update using (is_super_admin()) with check (is_super_admin());
