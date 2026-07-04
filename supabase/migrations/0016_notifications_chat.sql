create table notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  body text not null,
  type notification_type not null,
  action_url text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index notifications_user_idx on notifications(user_id, created_at desc);
create index notifications_unread_idx on notifications(user_id) where read_at is null;

create table ai_chat_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete set null,
  visitor_id text,
  professional_account_id uuid references professional_accounts(id) on delete set null,
  source_page text not null,
  status text not null default 'active' check (status in ('active', 'escalated', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index ai_chat_sessions_user_idx on ai_chat_sessions(user_id);
create index ai_chat_sessions_visitor_idx on ai_chat_sessions(visitor_id);

create trigger ai_chat_sessions_set_updated_at
  before update on ai_chat_sessions
  for each row execute function set_updated_at();

create table ai_chat_messages (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references ai_chat_sessions(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index ai_chat_messages_session_idx on ai_chat_messages(session_id, created_at);

-- Admin-editable AI knowledge base + system instructions used by the
-- ai-live-chat Edge Function (never hardcoded in client code).
create table ai_knowledge_base (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  content text not null,
  category text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger ai_knowledge_base_set_updated_at
  before update on ai_knowledge_base
  for each row execute function set_updated_at();

create table ai_chat_settings (
  id uuid primary key default uuid_generate_v4(),
  system_instructions text not null default '',
  rate_limit_per_hour int not null default 30,
  updated_by uuid references profiles(id),
  updated_at timestamptz not null default now()
);
