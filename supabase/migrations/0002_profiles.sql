create table profiles (
  id uuid primary key default uuid_generate_v4(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text not null,
  phone text,
  avatar_url text,
  role user_role not null default 'customer',
  city text,
  state text,
  country text not null default 'Nigeria',
  status account_status not null default 'active',
  onboarding_completed boolean not null default false,
  notification_preferences jsonb not null default '{"email": true, "sms": false}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_role_idx on profiles(role);
create index profiles_city_idx on profiles(city);
create index profiles_status_idx on profiles(status);
create unique index profiles_email_idx on profiles(lower(email));

create trigger profiles_set_updated_at
  before update on profiles
  for each row execute function set_updated_at();

-- Creates a `profiles` row automatically whenever a new Supabase Auth user
-- signs up. Runs as SECURITY DEFINER because the trigger fires before the
-- new user has any profile row RLS could otherwise authorize against.
create or replace function handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (auth_user_id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'customer')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_auth_user();
