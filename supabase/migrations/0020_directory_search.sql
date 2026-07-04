-- Server-side directory search with plan-based ranking boost. Exposed to
-- PostgREST as an RPC (`supabase.rpc('search_professionals', {...})`) so
-- filtering, sorting, and pagination all happen in Postgres rather than
-- shipping the full table to the client.
create or replace function search_professionals(
  p_keyword text default null,
  p_category_slug text default null,
  p_city text default null,
  p_state text default null,
  p_specialty_slugs text[] default null,
  p_price_range price_range default null,
  p_min_rating numeric default null,
  p_verified_only boolean default false,
  p_availability availability_status default null,
  p_sort text default 'relevance', -- relevance | rating | newest | verified | most_reviewed | premium
  p_page int default 1,
  p_page_size int default 20
)
returns table (
  id uuid,
  business_name text,
  slug text,
  city text,
  state text,
  logo_url text,
  cover_image_url text,
  price_range price_range,
  verification_status verification_level,
  rating_average numeric,
  review_count int,
  category_id uuid,
  plan_slug plan_slug,
  total_count bigint
)
language plpgsql
stable
as $$
declare
  v_offset int := greatest(p_page - 1, 0) * p_page_size;
begin
  return query
  with filtered as (
    select pa.*, sp.slug as plan_slug_value,
      case sp.slug when 'elite' then 3 when 'premium' then 2 when 'standard' then 1 else 0 end as plan_rank
    from professional_accounts pa
    left join subscription_plans sp on sp.id = pa.subscription_plan_id
    left join categories c on c.id = pa.category_id
    where pa.status = 'active'
      and (p_category_slug is null or c.slug = p_category_slug)
      and (p_city is null or pa.city ilike p_city)
      and (p_state is null or pa.state ilike p_state)
      and (p_price_range is null or pa.price_range = p_price_range)
      and (p_min_rating is null or pa.rating_average >= p_min_rating)
      and (not p_verified_only or pa.verification_status <> 'unverified')
      and (p_availability is null or pa.availability_status = p_availability)
      and (
        p_keyword is null or p_keyword = '' or
        pa.search_vector @@ plainto_tsquery('english', p_keyword)
      )
      and (
        p_specialty_slugs is null or array_length(p_specialty_slugs, 1) is null or
        exists (
          select 1 from professional_specialties ps
          join specialties s on s.id = ps.specialty_id
          where ps.professional_account_id = pa.id and s.slug = any(p_specialty_slugs)
        )
      )
  ),
  counted as (
    select *, count(*) over() as total_count from filtered
  )
  select
    counted.id, counted.business_name, counted.slug, counted.city, counted.state,
    counted.logo_url, counted.cover_image_url, counted.price_range, counted.verification_status,
    counted.rating_average, counted.review_count, counted.category_id, counted.plan_slug_value,
    counted.total_count
  from counted
  order by
    case when p_sort = 'premium' then counted.plan_rank end desc nulls last,
    case when p_sort = 'rating' then counted.rating_average end desc nulls last,
    case when p_sort = 'most_reviewed' then counted.review_count end desc nulls last,
    case when p_sort = 'verified' then (counted.verification_status <> 'unverified') end desc nulls last,
    case when p_sort = 'newest' then counted.created_at end desc nulls last,
    -- relevance (default): plan boost first, then rating, then recency
    counted.plan_rank desc,
    counted.rating_average desc,
    counted.created_at desc
  limit p_page_size offset v_offset;
end;
$$;
