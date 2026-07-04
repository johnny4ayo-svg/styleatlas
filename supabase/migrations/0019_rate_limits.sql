-- Generic sliding-window rate limiter shared by lead forms, AI chat,
-- reviews, login attempts, and request submissions. Edge Functions call
-- `check_rate_limit` before performing the guarded action.
create table rate_limit_events (
  id bigint generated always as identity primary key,
  bucket_key text not null,
  action text not null,
  created_at timestamptz not null default now()
);

create index rate_limit_events_lookup_idx on rate_limit_events(bucket_key, action, created_at desc);

-- Cheap periodic cleanup target; Edge Functions/cron can delete rows older
-- than the widest window in use (e.g. 24h) on a schedule.
create index rate_limit_events_created_idx on rate_limit_events(created_at);

create or replace function check_rate_limit(
  p_bucket_key text,
  p_action text,
  p_max_count int,
  p_window_seconds int
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_count int;
begin
  select count(*) into current_count
  from rate_limit_events
  where bucket_key = p_bucket_key
    and action = p_action
    and created_at > now() - make_interval(secs => p_window_seconds);

  if current_count >= p_max_count then
    return false;
  end if;

  insert into rate_limit_events (bucket_key, action) values (p_bucket_key, p_action);
  return true;
end;
$$;

comment on function check_rate_limit is
  'Returns true and records the attempt if under the limit, false if the caller should be rejected. bucket_key is typically an IP address, user id, or session id depending on the guarded action.';
