create table subscription_plans (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug plan_slug not null unique,
  description text not null default '',
  monthly_price numeric(12,2) not null default 0,
  yearly_price numeric(12,2) not null default 0,
  currency text not null default 'NGN',
  features jsonb not null default '[]'::jsonb,
  limits jsonb not null default '{}'::jsonb,
  badge text,
  paystack_plan_code_monthly text,
  paystack_plan_code_yearly text,
  flutterwave_plan_id_monthly text,
  flutterwave_plan_id_yearly text,
  sort_order int not null default 0,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index subscription_plans_slug_idx on subscription_plans(slug);
create index subscription_plans_status_idx on subscription_plans(status);

create trigger subscription_plans_set_updated_at
  before update on subscription_plans
  for each row execute function set_updated_at();

comment on table subscription_plans is
  'Single source of truth for plan pricing/limits. Frontend renders pricing UI from this table; Edge Functions validate every checkout and plan-gated action against it. Prices are never hardcoded in the client.';
