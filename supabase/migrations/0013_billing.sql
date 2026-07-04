create table subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  professional_account_id uuid references professional_accounts(id) on delete cascade,
  plan_id uuid not null references subscription_plans(id),
  provider payment_provider not null,
  provider_customer_id text,
  provider_subscription_id text,
  billing_cycle billing_cycle not null,
  status subscription_status not null default 'active',
  current_period_start timestamptz not null default now(),
  current_period_end timestamptz not null,
  cancel_at_period_end boolean not null default false,
  canceled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index subscriptions_user_idx on subscriptions(user_id);
create index subscriptions_account_idx on subscriptions(professional_account_id);
create index subscriptions_status_idx on subscriptions(status);
create index subscriptions_period_end_idx on subscriptions(current_period_end);
create unique index subscriptions_provider_sub_idx on subscriptions(provider, provider_subscription_id)
  where provider_subscription_id is not null;

create trigger subscriptions_set_updated_at
  before update on subscriptions
  for each row execute function set_updated_at();

create table payment_transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  professional_account_id uuid references professional_accounts(id) on delete cascade,
  plan_id uuid references subscription_plans(id),
  subscription_id uuid references subscriptions(id),
  provider payment_provider not null,
  reference text not null,
  amount numeric(12,2) not null,
  currency text not null default 'NGN',
  billing_cycle billing_cycle,
  status transaction_status not null default 'pending',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index payment_transactions_provider_ref_idx on payment_transactions(provider, reference);
create index payment_transactions_user_idx on payment_transactions(user_id);
create index payment_transactions_status_idx on payment_transactions(status);

create trigger payment_transactions_set_updated_at
  before update on payment_transactions
  for each row execute function set_updated_at();

-- Idempotency ledger for provider webhooks. Edge Functions insert the
-- provider's event_id here BEFORE acting on it; a unique violation means
-- "already processed" and the function short-circuits with 200 OK.
create table webhook_events (
  id uuid primary key default uuid_generate_v4(),
  provider payment_provider not null,
  event_id text not null,
  event_type text not null,
  payload jsonb not null,
  processed_at timestamptz,
  status text not null default 'received' check (status in ('received', 'processed', 'failed', 'ignored')),
  error_message text,
  created_at timestamptz not null default now(),
  unique (provider, event_id)
);

create index webhook_events_status_idx on webhook_events(status);

create table featured_placements (
  id uuid primary key default uuid_generate_v4(),
  professional_account_id uuid not null references professional_accounts(id) on delete cascade,
  placement_type text not null check (placement_type in ('homepage', 'category', 'city', 'search_top')),
  city text,
  category_id uuid references categories(id),
  start_date timestamptz not null default now(),
  end_date timestamptz not null,
  status text not null default 'active' check (status in ('active', 'expired', 'canceled')),
  created_at timestamptz not null default now()
);

create index featured_placements_account_idx on featured_placements(professional_account_id);
create index featured_placements_active_idx on featured_placements(status, end_date);

-- Every manual admin override of a subscription must be audited (billing
-- changes are explicitly called out in the security requirements).
create table subscription_overrides (
  id uuid primary key default uuid_generate_v4(),
  subscription_id uuid not null references subscriptions(id) on delete cascade,
  performed_by uuid not null references profiles(id),
  action text not null check (action in ('extend', 'downgrade', 'upgrade', 'cancel', 'reactivate')),
  reason text not null,
  previous_state jsonb not null,
  new_state jsonb not null,
  created_at timestamptz not null default now()
);

create index subscription_overrides_subscription_idx on subscription_overrides(subscription_id);
