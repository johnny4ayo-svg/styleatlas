create table audit_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid references profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index audit_logs_actor_idx on audit_logs(actor_id);
create index audit_logs_entity_idx on audit_logs(entity_type, entity_id);
create index audit_logs_created_idx on audit_logs(created_at desc);

create table analytics_events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete set null,
  professional_account_id uuid references professional_accounts(id) on delete cascade,
  event_type text not null,
  source_page text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index analytics_events_account_idx on analytics_events(professional_account_id, event_type, created_at desc);
create index analytics_events_type_idx on analytics_events(event_type);
create index analytics_events_created_idx on analytics_events(created_at desc);

-- Security event log (failed logins, rate-limit trips, suspicious activity)
-- reviewed by super admins under "Security logs".
create table security_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid references profiles(id) on delete set null,
  event_type text not null check (event_type in (
    'failed_login', 'rate_limit_exceeded', 'suspicious_review_activity',
    'webhook_signature_failure', 'unauthorized_access_attempt', 'password_reset_requested'
  )),
  ip_address text,
  user_agent text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index security_logs_event_type_idx on security_logs(event_type);
create index security_logs_created_idx on security_logs(created_at desc);

create table feature_flags (
  id uuid primary key default uuid_generate_v4(),
  key text not null unique,
  description text,
  enabled boolean not null default false,
  rollout_percentage int not null default 100 check (rollout_percentage between 0 and 100),
  updated_by uuid references profiles(id),
  updated_at timestamptz not null default now()
);

create table platform_settings (
  key text primary key,
  value jsonb not null,
  updated_by uuid references profiles(id),
  updated_at timestamptz not null default now()
);
