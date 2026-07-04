-- Recomputes the profile completion score (0-100) whenever a
-- professional_accounts row changes, or related child rows are added.
create or replace function compute_profile_completion_score(p_account_id uuid)
returns int
language plpgsql
as $$
declare
  pa professional_accounts%rowtype;
  score int := 0;
  portfolio_count int;
  service_count int;
begin
  select * into pa from professional_accounts where id = p_account_id;
  if not found then return 0; end if;

  if pa.business_name is not null and pa.business_name <> '' then score := score + 10; end if;
  if pa.description is not null and length(pa.description) > 40 then score := score + 15; end if;
  if pa.logo_url is not null then score := score + 10; end if;
  if pa.cover_image_url is not null then score := score + 10; end if;
  if pa.phone is not null or pa.whatsapp is not null then score := score + 10; end if;
  if pa.address is not null then score := score + 5; end if;
  if pa.price_range is not null then score := score + 5; end if;

  select count(*) into portfolio_count from portfolio_items where professional_account_id = p_account_id and status = 'active';
  score := score + least(portfolio_count * 3, 15);

  select count(*) into service_count from services where professional_account_id = p_account_id and status = 'active';
  score := score + least(service_count * 3, 10);

  if pa.verification_status <> 'unverified' then score := score + 10; end if;

  return least(score, 100);
end;
$$;

create or replace function professional_accounts_refresh_completion()
returns trigger
language plpgsql
as $$
begin
  new.profile_completion_score := compute_profile_completion_score(new.id);
  return new;
end;
$$;

-- Runs on UPDATE only (INSERT already defaults to 0, refreshed on first edit).
create trigger professional_accounts_completion_trigger
  before update of business_name, description, logo_url, cover_image_url, phone, whatsapp, address, price_range, verification_status
  on professional_accounts
  for each row execute function professional_accounts_refresh_completion();

-- Recompute completion when portfolio/services change (child-table driven).
create or replace function bump_owner_completion_from_child()
returns trigger
language plpgsql
as $$
declare
  v_account_id uuid := coalesce(new.professional_account_id, old.professional_account_id);
begin
  update professional_accounts
  set profile_completion_score = compute_profile_completion_score(v_account_id)
  where id = v_account_id;
  return coalesce(new, old);
end;
$$;

create trigger portfolio_items_bump_completion
  after insert or update or delete on portfolio_items
  for each row execute function bump_owner_completion_from_child();

create trigger services_bump_completion
  after insert or update or delete on services
  for each row execute function bump_owner_completion_from_child();

-- ── Plan-limit enforcement helper ───────────────────────────────────────
-- Reads the (jsonb) `limits` column on subscription_plans so limits are
-- data-driven, not hardcoded. Edge Functions and RLS-adjacent server
-- actions call this before allowing a plan-gated write.
create or replace function get_plan_limit(p_account_id uuid, p_limit_key text)
returns jsonb
language sql
stable
as $$
  select sp.limits -> p_limit_key
  from professional_accounts pa
  join subscription_plans sp on sp.id = pa.subscription_plan_id
  where pa.id = p_account_id;
$$;

create or replace function can_add_portfolio_item(p_account_id uuid)
returns boolean
language plpgsql
stable
as $$
declare
  v_limit int;
  v_count int;
begin
  select coalesce(get_plan_limit(p_account_id, 'portfolio_images')::int, 6) into v_limit;
  select count(*) into v_count from portfolio_items where professional_account_id = p_account_id and status = 'active';
  return v_count < v_limit;
end;
$$;

create or replace function can_post_job(p_account_id uuid)
returns boolean
language plpgsql
stable
as $$
declare
  v_limit int;
  v_count int;
begin
  select coalesce(get_plan_limit(p_account_id, 'job_postings')::int, 0) into v_limit;
  select count(*) into v_count
  from jobs
  where professional_account_id = p_account_id
    and status in ('active', 'pending')
    and created_at > now() - interval '30 days';
  return v_count < v_limit;
end;
$$;
