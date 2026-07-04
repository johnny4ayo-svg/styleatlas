create table leads (
  id uuid primary key default uuid_generate_v4(),
  source_type lead_source_type not null,
  source_page text not null,
  professional_account_id uuid references professional_accounts(id) on delete set null,
  customer_id uuid references profiles(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  whatsapp text,
  city text,
  state text,
  category_id uuid references categories(id),
  budget text,
  message text,
  status lead_status not null default 'new',
  assigned_professional_id uuid references professional_accounts(id),
  utm_source text,
  utm_medium text,
  utm_campaign text,
  device_info jsonb,
  consent_given_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index leads_account_idx on leads(professional_account_id);
create index leads_customer_idx on leads(customer_id);
create index leads_status_idx on leads(status);
create index leads_source_idx on leads(source_type);
create index leads_created_idx on leads(created_at desc);

create trigger leads_set_updated_at
  before update on leads
  for each row execute function set_updated_at();

create table conversations (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid not null references profiles(id) on delete cascade,
  professional_account_id uuid not null references professional_accounts(id) on delete cascade,
  last_message_at timestamptz,
  status text not null default 'active' check (status in ('active', 'archived', 'blocked')),
  created_at timestamptz not null default now(),
  unique (customer_id, professional_account_id)
);

create index conversations_customer_idx on conversations(customer_id);
create index conversations_account_idx on conversations(professional_account_id);
create index conversations_last_message_idx on conversations(last_message_at desc);

create table messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id uuid not null references profiles(id),
  receiver_id uuid not null references profiles(id),
  body text not null,
  attachments text[] not null default '{}',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index messages_conversation_idx on messages(conversation_id, created_at);
create index messages_receiver_idx on messages(receiver_id);

create or replace function conversations_touch_last_message()
returns trigger
language plpgsql
as $$
begin
  update conversations set last_message_at = new.created_at where id = new.conversation_id;
  return new;
end;
$$;

create trigger messages_touch_conversation
  after insert on messages
  for each row execute function conversations_touch_last_message();

create table favorites (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  entity_type favorite_entity_type not null,
  entity_id uuid not null,
  created_at timestamptz not null default now(),
  unique (user_id, entity_type, entity_id)
);

create index favorites_user_idx on favorites(user_id);
create index favorites_entity_idx on favorites(entity_type, entity_id);
