create table categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  parent_id uuid references categories(id) on delete set null,
  icon text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  seo_title text,
  seo_description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index categories_slug_idx on categories(slug);
create index categories_parent_idx on categories(parent_id);
create index categories_status_idx on categories(status);

create trigger categories_set_updated_at
  before update on categories
  for each row execute function set_updated_at();

create table specialties (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null,
  category_id uuid references categories(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  unique (category_id, slug)
);

create index specialties_category_idx on specialties(category_id);

create table professional_specialties (
  professional_account_id uuid not null,
  specialty_id uuid not null references specialties(id) on delete cascade,
  primary key (professional_account_id, specialty_id)
);
