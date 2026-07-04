create table support_tickets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete set null,
  subject text not null,
  message text not null,
  category text not null default 'general' check (category in (
    'general', 'billing', 'verification', 'technical', 'abuse_report', 'account'
  )),
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  assigned_to uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index support_tickets_user_idx on support_tickets(user_id);
create index support_tickets_status_idx on support_tickets(status);

create trigger support_tickets_set_updated_at
  before update on support_tickets
  for each row execute function set_updated_at();

create table support_ticket_replies (
  id uuid primary key default uuid_generate_v4(),
  ticket_id uuid not null references support_tickets(id) on delete cascade,
  author_id uuid not null references profiles(id),
  body text not null,
  created_at timestamptz not null default now()
);

create index support_ticket_replies_ticket_idx on support_ticket_replies(ticket_id);

-- Sent-email log for the Resend integration (deliverability + audit trail).
create table email_logs (
  id uuid primary key default uuid_generate_v4(),
  recipient_email text not null,
  template text not null,
  subject text not null,
  variables jsonb not null default '{}'::jsonb,
  resend_message_id text,
  status text not null default 'sent' check (status in ('queued', 'sent', 'failed', 'bounced')),
  error_message text,
  created_at timestamptz not null default now()
);

create index email_logs_recipient_idx on email_logs(recipient_email);
create index email_logs_template_idx on email_logs(template);

-- Sponsored / advertising placements referenced by the admin dashboard.
create table ad_placements (
  id uuid primary key default uuid_generate_v4(),
  advertiser_name text not null,
  placement_location text not null check (placement_location in (
    'homepage_banner', 'directory_sidebar', 'blog_inline', 'search_results'
  )),
  image_url text not null,
  target_url text not null,
  start_date timestamptz not null,
  end_date timestamptz not null,
  status text not null default 'active' check (status in ('active', 'paused', 'expired')),
  impression_count int not null default 0,
  click_count int not null default 0,
  created_at timestamptz not null default now()
);

create index ad_placements_status_idx on ad_placements(status);
