create table seo_pages (
  id uuid primary key default uuid_generate_v4(),
  page_type text not null check (page_type in (
    'category_city', 'category', 'city', 'static', 'landing'
  )),
  slug text not null unique,
  city text,
  state text,
  category_id uuid references categories(id),
  title text not null,
  h1 text not null,
  intro_content text not null default '',
  faq_json jsonb not null default '[]'::jsonb,
  seo_title text,
  meta_description text,
  canonical_url text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index seo_pages_slug_idx on seo_pages(slug);
create index seo_pages_page_type_idx on seo_pages(page_type);
create index seo_pages_city_idx on seo_pages(city);
create index seo_pages_category_idx on seo_pages(category_id);

create trigger seo_pages_set_updated_at
  before update on seo_pages
  for each row execute function set_updated_at();

create table redirects (
  id uuid primary key default uuid_generate_v4(),
  from_path text not null unique,
  to_path text not null,
  status_code int not null default 301 check (status_code in (301, 302, 307, 308)),
  created_at timestamptz not null default now()
);

create index redirects_from_path_idx on redirects(from_path);
