create table services (
  id uuid primary key default uuid_generate_v4(),
  professional_account_id uuid not null references professional_accounts(id) on delete cascade,
  name text not null,
  description text,
  price_min numeric(12,2),
  price_max numeric(12,2),
  duration text,
  status text not null default 'active' check (status in ('active', 'hidden')),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index services_account_idx on services(professional_account_id);
create index services_status_idx on services(status);

create trigger services_set_updated_at
  before update on services
  for each row execute function set_updated_at();

create table portfolio_items (
  id uuid primary key default uuid_generate_v4(),
  professional_account_id uuid not null references professional_accounts(id) on delete cascade,
  title text not null,
  description text,
  image_url text not null,
  video_url text,
  category_id uuid references categories(id),
  tags text[] not null default '{}',
  alt_text text not null default '',
  status text not null default 'active' check (status in ('active', 'hidden')),
  sort_order int not null default 0,
  view_count int not null default 0,
  created_at timestamptz not null default now()
);

create index portfolio_items_account_idx on portfolio_items(professional_account_id);
create index portfolio_items_status_idx on portfolio_items(status);
create index portfolio_items_category_idx on portfolio_items(category_id);
