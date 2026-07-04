create table customer_requests (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  category_id uuid not null references categories(id),
  city text not null,
  state text not null,
  style_needed text,
  budget_min numeric(12,2),
  budget_max numeric(12,2),
  deadline date,
  number_of_outfits int,
  measurements_status text check (measurements_status in ('have', 'need_help', 'not_applicable')),
  details text not null,
  inspiration_files text[] not null default '{}',
  preferred_contact_method text check (preferred_contact_method in ('whatsapp', 'phone', 'email')),
  consent_given boolean not null default false,
  status request_status not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index customer_requests_customer_idx on customer_requests(customer_id);
create index customer_requests_category_idx on customer_requests(category_id);
create index customer_requests_city_idx on customer_requests(city);
create index customer_requests_status_idx on customer_requests(status);

create trigger customer_requests_set_updated_at
  before update on customer_requests
  for each row execute function set_updated_at();

create table request_responses (
  id uuid primary key default uuid_generate_v4(),
  request_id uuid not null references customer_requests(id) on delete cascade,
  professional_account_id uuid not null references professional_accounts(id) on delete cascade,
  message text not null,
  quote_min numeric(12,2),
  quote_max numeric(12,2),
  status response_status not null default 'submitted',
  created_at timestamptz not null default now(),
  unique (request_id, professional_account_id)
);

create index request_responses_request_idx on request_responses(request_id);
create index request_responses_account_idx on request_responses(professional_account_id);

-- ── Matching table: which professionals were notified for a request ────
create table request_matches (
  id uuid primary key default uuid_generate_v4(),
  request_id uuid not null references customer_requests(id) on delete cascade,
  professional_account_id uuid not null references professional_accounts(id) on delete cascade,
  match_score numeric(5,2) not null default 0,
  notified_at timestamptz,
  created_at timestamptz not null default now(),
  unique (request_id, professional_account_id)
);

create index request_matches_request_idx on request_matches(request_id);
create index request_matches_account_idx on request_matches(professional_account_id);
