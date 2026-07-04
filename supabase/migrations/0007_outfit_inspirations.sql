create table outfit_inspirations (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  description text,
  image_url text not null,
  video_url text,
  category_id uuid not null references categories(id),
  designer_id uuid references professional_accounts(id) on delete set null,
  occasion text,
  color text,
  tags text[] not null default '{}',
  alt_text text not null default '',
  status listing_status not null default 'pending',
  seo_title text,
  seo_description text,
  view_count int not null default 0,
  save_count int not null default 0,
  search_vector tsvector,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index outfit_inspirations_slug_idx on outfit_inspirations(slug);
create index outfit_inspirations_category_idx on outfit_inspirations(category_id);
create index outfit_inspirations_designer_idx on outfit_inspirations(designer_id);
create index outfit_inspirations_status_idx on outfit_inspirations(status);
create index outfit_inspirations_tags_idx on outfit_inspirations using gin(tags);
create index outfit_inspirations_search_idx on outfit_inspirations using gin(search_vector);

create trigger outfit_inspirations_set_updated_at
  before update on outfit_inspirations
  for each row execute function set_updated_at();

create or replace function outfit_inspirations_search_vector_update()
returns trigger
language plpgsql
as $$
begin
  new.search_vector :=
    setweight(to_tsvector('english', coalesce(new.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.occasion, '') || ' ' || coalesce(new.color, '')), 'B') ||
    setweight(to_tsvector('english', array_to_string(new.tags, ' ')), 'B') ||
    setweight(to_tsvector('english', coalesce(new.description, '')), 'C');
  return new;
end;
$$;

create trigger outfit_inspirations_search_vector_trigger
  before insert or update of title, occasion, color, tags, description on outfit_inspirations
  for each row execute function outfit_inspirations_search_vector_update();
