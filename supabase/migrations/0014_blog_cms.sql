create table blog_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  seo_title text,
  meta_description text,
  created_at timestamptz not null default now()
);

create table blog_tags (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table blog_posts (
  id uuid primary key default uuid_generate_v4(),
  author_id uuid not null references profiles(id),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null default '',
  content_json jsonb,
  featured_image_url text,
  featured_image_alt text,
  status blog_status not null default 'draft',
  published_at timestamptz,
  scheduled_at timestamptz,
  seo_title text,
  meta_description text,
  canonical_url text,
  focus_keyword text,
  og_title text,
  og_description text,
  og_image_url text,
  twitter_card_type text default 'summary_large_image',
  noindex boolean not null default false,
  is_sponsored boolean not null default false,
  schema_type schema_type not null default 'BlogPosting',
  faq_json jsonb not null default '[]'::jsonb,
  reading_time int not null default 1,
  view_count int not null default 0,
  search_vector tsvector,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index blog_posts_slug_idx on blog_posts(slug);
create index blog_posts_status_idx on blog_posts(status);
create index blog_posts_published_idx on blog_posts(published_at desc);
create index blog_posts_author_idx on blog_posts(author_id);
create index blog_posts_search_idx on blog_posts using gin(search_vector);

create trigger blog_posts_set_updated_at
  before update on blog_posts
  for each row execute function set_updated_at();

create or replace function blog_posts_search_vector_update()
returns trigger
language plpgsql
as $$
begin
  new.search_vector :=
    setweight(to_tsvector('english', coalesce(new.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.excerpt, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(new.content, '')), 'C');
  return new;
end;
$$;

create trigger blog_posts_search_vector_trigger
  before insert or update of title, excerpt, content on blog_posts
  for each row execute function blog_posts_search_vector_update();

create table blog_post_categories (
  post_id uuid not null references blog_posts(id) on delete cascade,
  category_id uuid not null references blog_categories(id) on delete cascade,
  primary key (post_id, category_id)
);

create table blog_post_tags (
  post_id uuid not null references blog_posts(id) on delete cascade,
  tag_id uuid not null references blog_tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

create index blog_post_categories_category_idx on blog_post_categories(category_id);
create index blog_post_tags_tag_idx on blog_post_tags(tag_id);

-- Revision history + autosave support for the editor.
create table blog_post_revisions (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid not null references blog_posts(id) on delete cascade,
  editor_id uuid not null references profiles(id),
  title text not null,
  content text not null,
  content_json jsonb,
  is_autosave boolean not null default false,
  created_at timestamptz not null default now()
);

create index blog_post_revisions_post_idx on blog_post_revisions(post_id, created_at desc);

create table media_assets (
  id uuid primary key default uuid_generate_v4(),
  uploaded_by uuid not null references profiles(id),
  file_url text not null,
  file_path text not null,
  file_type text not null check (file_type in ('image', 'video', 'document')),
  mime_type text not null,
  size bigint not null,
  width int,
  height int,
  alt_text text,
  caption text,
  created_at timestamptz not null default now()
);

create index media_assets_uploaded_by_idx on media_assets(uploaded_by);
create index media_assets_type_idx on media_assets(file_type);
