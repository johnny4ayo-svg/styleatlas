-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";
create extension if not exists "unaccent";

-- ── Enum types ──────────────────────────────────────────────────────────
create type user_role as enum ('visitor', 'customer', 'professional', 'professional_staff', 'admin', 'super_admin');
create type account_status as enum ('active', 'suspended', 'deleted');
create type listing_status as enum ('draft', 'pending', 'active', 'suspended', 'rejected');
create type availability_status as enum ('available', 'booked', 'unavailable');
create type verification_level as enum ('unverified', 'identity_verified', 'business_verified', 'address_verified', 'premium_verified');
create type verification_request_status as enum ('pending', 'in_review', 'approved', 'rejected', 'expired');
create type price_range as enum ('budget', 'mid', 'premium', 'luxury');
create type review_status as enum ('pending', 'published', 'hidden', 'rejected');
create type request_status as enum ('open', 'matched', 'closed', 'spam');
create type response_status as enum ('submitted', 'viewed', 'accepted', 'declined');
create type lead_source_type as enum (
  'profile_inquiry', 'whatsapp_click', 'phone_reveal', 'contact_form', 'marketplace_request',
  'ai_chat', 'blog_cta', 'inspiration_cta', 'pricing_cta', 'event_cta', 'school_inquiry', 'job_application'
);
create type lead_status as enum ('new', 'viewed', 'contacted', 'responded', 'won', 'lost', 'spam', 'archived');
create type job_type as enum ('full_time', 'part_time', 'contract', 'internship');
create type event_type as enum ('fashion_show', 'workshop', 'exhibition', 'competition', 'training', 'pop_up_shop', 'brand_launch');
create type plan_slug as enum ('free', 'standard', 'premium', 'elite');
create type billing_cycle as enum ('monthly', 'yearly');
create type payment_provider as enum ('paystack', 'flutterwave');
create type subscription_status as enum ('active', 'past_due', 'canceled', 'expired', 'trialing', 'incomplete');
create type transaction_status as enum ('pending', 'success', 'failed', 'refunded');
create type blog_status as enum ('draft', 'scheduled', 'published', 'archived');
create type schema_type as enum ('Article', 'BlogPosting', 'NewsArticle');
create type favorite_entity_type as enum ('professional_account', 'outfit_inspiration', 'job', 'event', 'blog_post');
create type notification_type as enum (
  'lead', 'message', 'review', 'verification', 'payment', 'subscription', 'system', 'moderation'
);

-- ── Shared trigger: keep updated_at fresh ───────────────────────────────
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── Shared trigger: auto-generate a unique slug from a source column ───
create or replace function generate_unique_slug(base_text text, table_name text, column_name text default 'slug', existing_id uuid default null)
returns text
language plpgsql
as $$
declare
  candidate text;
  suffix int := 0;
  exists_row boolean;
begin
  candidate := trim(both '-' from regexp_replace(lower(unaccent(base_text)), '[^a-z0-9]+', '-', 'g'));
  if candidate = '' then
    candidate := 'item';
  end if;

  loop
    execute format(
      'select exists(select 1 from %I where %I = $1 and ($2 is null or id <> $2))',
      table_name, column_name
    ) into exists_row using candidate, existing_id;

    exit when not exists_row;
    suffix := suffix + 1;
    candidate := candidate || '-' || suffix;
  end loop;

  return candidate;
end;
$$;
