create table reviews (
  id uuid primary key default uuid_generate_v4(),
  professional_account_id uuid not null references professional_accounts(id) on delete cascade,
  customer_id uuid not null references profiles(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  title text,
  body text not null,
  service_used text,
  communication_rating smallint check (communication_rating between 1 and 5),
  quality_rating smallint check (quality_rating between 1 and 5),
  delivery_rating smallint check (delivery_rating between 1 and 5),
  value_rating smallint check (value_rating between 1 and 5),
  order_completed_at date,
  status review_status not null default 'pending',
  professional_reply text,
  professional_reply_at timestamptz,
  report_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (professional_account_id, customer_id, service_used)
);

create index reviews_account_idx on reviews(professional_account_id);
create index reviews_customer_idx on reviews(customer_id);
create index reviews_status_idx on reviews(status);
create index reviews_created_idx on reviews(created_at desc);

create trigger reviews_set_updated_at
  before update on reviews
  for each row execute function set_updated_at();

create table review_photos (
  id uuid primary key default uuid_generate_v4(),
  review_id uuid not null references reviews(id) on delete cascade,
  image_url text not null,
  alt_text text,
  status text not null default 'active' check (status in ('active', 'hidden')),
  created_at timestamptz not null default now()
);

create index review_photos_review_idx on review_photos(review_id);

create table review_reports (
  id uuid primary key default uuid_generate_v4(),
  review_id uuid not null references reviews(id) on delete cascade,
  reported_by uuid not null references profiles(id),
  reason text not null,
  status text not null default 'pending' check (status in ('pending', 'resolved', 'dismissed')),
  created_at timestamptz not null default now()
);

create index review_reports_review_idx on review_reports(review_id);

-- ── Aggregate rating rollup on professional_accounts ────────────────────
alter table professional_accounts add column if not exists rating_average numeric(3,2) not null default 0;
alter table professional_accounts add column if not exists review_count int not null default 0;

create or replace function refresh_professional_rating(p_account_id uuid)
returns void
language plpgsql
as $$
begin
  update professional_accounts pa
  set rating_average = coalesce(r.avg_rating, 0),
      review_count = coalesce(r.review_count, 0)
  from (
    select professional_account_id, round(avg(rating)::numeric, 2) as avg_rating, count(*) as review_count
    from reviews
    where professional_account_id = p_account_id and status = 'published'
    group by professional_account_id
  ) r
  where pa.id = p_account_id and r.professional_account_id = p_account_id;

  -- No published reviews left: reset to zero instead of leaving stale values.
  update professional_accounts
  set rating_average = 0, review_count = 0
  where id = p_account_id
    and not exists (
      select 1 from reviews where professional_account_id = p_account_id and status = 'published'
    );
end;
$$;

create or replace function reviews_after_change()
returns trigger
language plpgsql
as $$
begin
  perform refresh_professional_rating(coalesce(new.professional_account_id, old.professional_account_id));
  return coalesce(new, old);
end;
$$;

create trigger reviews_after_change_trigger
  after insert or update of status or delete on reviews
  for each row execute function reviews_after_change();
