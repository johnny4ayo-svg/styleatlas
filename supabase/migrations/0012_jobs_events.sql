create table jobs (
  id uuid primary key default uuid_generate_v4(),
  professional_account_id uuid references professional_accounts(id) on delete cascade,
  posted_by uuid references profiles(id),
  title text not null,
  slug text not null unique,
  description text not null,
  location text,
  city text not null,
  state text not null,
  is_remote boolean not null default false,
  job_type job_type not null default 'full_time',
  salary_min numeric(12,2),
  salary_max numeric(12,2),
  application_url text,
  application_email text,
  status listing_status not null default 'pending',
  expires_at timestamptz,
  seo_title text,
  seo_description text,
  view_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index jobs_account_idx on jobs(professional_account_id);
create index jobs_city_idx on jobs(city);
create index jobs_status_idx on jobs(status);
create index jobs_type_idx on jobs(job_type);
create index jobs_expires_idx on jobs(expires_at);

create trigger jobs_set_updated_at
  before update on jobs
  for each row execute function set_updated_at();

create table job_applications (
  id uuid primary key default uuid_generate_v4(),
  job_id uuid not null references jobs(id) on delete cascade,
  user_id uuid references profiles(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  resume_url text,
  cover_note text,
  status text not null default 'submitted' check (status in ('submitted', 'reviewed', 'shortlisted', 'rejected', 'hired')),
  created_at timestamptz not null default now()
);

create index job_applications_job_idx on job_applications(job_id);
create index job_applications_user_idx on job_applications(user_id);

create table events (
  id uuid primary key default uuid_generate_v4(),
  professional_account_id uuid references professional_accounts(id) on delete cascade,
  posted_by uuid references profiles(id),
  title text not null,
  slug text not null unique,
  description text not null,
  event_type event_type not null,
  venue text not null,
  city text not null,
  state text not null,
  start_time timestamptz not null,
  end_time timestamptz,
  ticket_url text,
  registration_url text,
  image_url text,
  gallery_urls text[] not null default '{}',
  status listing_status not null default 'pending',
  seo_title text,
  seo_description text,
  view_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index events_account_idx on events(professional_account_id);
create index events_city_idx on events(city);
create index events_status_idx on events(status);
create index events_start_time_idx on events(start_time);

create trigger events_set_updated_at
  before update on events
  for each row execute function set_updated_at();
