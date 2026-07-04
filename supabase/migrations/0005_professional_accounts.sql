create table professional_accounts (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references profiles(id) on delete cascade,
  business_name text not null,
  slug text not null unique,
  description text,
  brand_story text,
  category_id uuid not null references categories(id),
  logo_url text,
  cover_image_url text,
  phone text,
  whatsapp text,
  email text,
  website text,
  instagram text,
  tiktok text,
  facebook text,
  youtube text,
  address text,
  city text not null,
  state text not null,
  country text not null default 'Nigeria',
  latitude double precision,
  longitude double precision,
  price_range price_range,
  availability_status availability_status not null default 'available',
  opening_hours jsonb default '{}'::jsonb,
  verification_status verification_level not null default 'unverified',
  subscription_plan_id uuid references subscription_plans(id),
  subscription_status subscription_status not null default 'active',
  profile_completion_score int not null default 0,
  is_claimed boolean not null default true,
  created_by_admin boolean not null default false,
  status listing_status not null default 'pending',
  search_vector tsvector,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index professional_accounts_owner_idx on professional_accounts(owner_id);
create index professional_accounts_category_idx on professional_accounts(category_id);
create index professional_accounts_city_idx on professional_accounts(city);
create index professional_accounts_state_idx on professional_accounts(state);
create index professional_accounts_status_idx on professional_accounts(status);
create index professional_accounts_verification_idx on professional_accounts(verification_status);
create index professional_accounts_plan_idx on professional_accounts(subscription_plan_id);
create index professional_accounts_slug_idx on professional_accounts(slug);
create index professional_accounts_search_idx on professional_accounts using gin(search_vector);
create index professional_accounts_city_trgm_idx on professional_accounts using gin(city gin_trgm_ops);
create index professional_accounts_name_trgm_idx on professional_accounts using gin(business_name gin_trgm_ops);

create trigger professional_accounts_set_updated_at
  before update on professional_accounts
  for each row execute function set_updated_at();

create or replace function professional_accounts_search_vector_update()
returns trigger
language plpgsql
as $$
begin
  new.search_vector :=
    setweight(to_tsvector('english', coalesce(new.business_name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.city, '') || ' ' || coalesce(new.state, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(new.description, '')), 'C');
  return new;
end;
$$;

create trigger professional_accounts_search_vector_trigger
  before insert or update of business_name, city, state, description on professional_accounts
  for each row execute function professional_accounts_search_vector_update();

alter table professional_specialties
  add constraint professional_specialties_account_fk
  foreign key (professional_account_id) references professional_accounts(id) on delete cascade;

create index professional_specialties_specialty_idx on professional_specialties(specialty_id);

-- ── Staff accounts (invited by a professional account owner) ───────────
create table professional_staff (
  id uuid primary key default uuid_generate_v4(),
  professional_account_id uuid not null references professional_accounts(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  permissions jsonb not null default '[]'::jsonb,
  status text not null default 'invited' check (status in ('invited', 'active', 'revoked')),
  invited_by uuid not null references profiles(id),
  created_at timestamptz not null default now(),
  unique (professional_account_id, user_id)
);

create index professional_staff_account_idx on professional_staff(professional_account_id);
create index professional_staff_user_idx on professional_staff(user_id);

-- ── Brand-specific fields ───────────────────────────────────────────────
create table brand_profiles (
  professional_account_id uuid primary key references professional_accounts(id) on delete cascade,
  lookbook_urls text[] not null default '{}',
  product_categories text[] not null default '{}',
  stockist_locations jsonb not null default '[]'::jsonb,
  founded_year int,
  created_at timestamptz not null default now()
);

-- ── Fashion-school-specific fields ──────────────────────────────────────
create table school_profiles (
  professional_account_id uuid primary key references professional_accounts(id) on delete cascade,
  courses jsonb not null default '[]'::jsonb,
  duration text,
  fees_range text,
  admission_status text default 'open' check (admission_status in ('open', 'closed', 'waitlist')),
  training_modes text[] not null default '{}',
  certificate_info text,
  course_categories text[] not null default '{}',
  created_at timestamptz not null default now()
);
