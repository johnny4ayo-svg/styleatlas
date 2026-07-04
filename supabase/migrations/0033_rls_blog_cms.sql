alter table blog_posts enable row level security;
alter table blog_categories enable row level security;
alter table blog_tags enable row level security;
alter table blog_post_categories enable row level security;
alter table blog_post_tags enable row level security;
alter table blog_post_revisions enable row level security;
alter table media_assets enable row level security;

create policy "blog_posts_public_read" on blog_posts
  for select using (
    (status = 'published' and published_at <= now())
    or author_id = current_profile_id()
    or is_admin()
  );

create policy "blog_posts_author_insert" on blog_posts
  for insert with check (
    author_id = current_profile_id()
    and current_role_name() in ('admin', 'super_admin')
  );

create policy "blog_posts_author_update" on blog_posts
  for update using (author_id = current_profile_id() or is_admin())
  with check (author_id = current_profile_id() or is_admin());

create policy "blog_posts_admin_delete" on blog_posts
  for delete using (is_admin());

create policy "blog_categories_public_read" on blog_categories for select using (true);
create policy "blog_categories_admin_write" on blog_categories for insert with check (is_admin());
create policy "blog_categories_admin_update" on blog_categories for update using (is_admin()) with check (is_admin());
create policy "blog_categories_admin_delete" on blog_categories for delete using (is_admin());

create policy "blog_tags_public_read" on blog_tags for select using (true);
create policy "blog_tags_admin_write" on blog_tags for insert with check (is_admin());
create policy "blog_tags_admin_delete" on blog_tags for delete using (is_admin());

create policy "blog_post_categories_public_read" on blog_post_categories for select using (true);
create policy "blog_post_categories_author_write" on blog_post_categories
  for insert with check (
    exists (select 1 from blog_posts p where p.id = post_id and (p.author_id = current_profile_id() or is_admin()))
  );
create policy "blog_post_categories_author_delete" on blog_post_categories
  for delete using (
    exists (select 1 from blog_posts p where p.id = post_id and (p.author_id = current_profile_id() or is_admin()))
  );

create policy "blog_post_tags_public_read" on blog_post_tags for select using (true);
create policy "blog_post_tags_author_write" on blog_post_tags
  for insert with check (
    exists (select 1 from blog_posts p where p.id = post_id and (p.author_id = current_profile_id() or is_admin()))
  );
create policy "blog_post_tags_author_delete" on blog_post_tags
  for delete using (
    exists (select 1 from blog_posts p where p.id = post_id and (p.author_id = current_profile_id() or is_admin()))
  );

create policy "blog_post_revisions_select" on blog_post_revisions
  for select using (editor_id = current_profile_id() or is_admin());
create policy "blog_post_revisions_insert" on blog_post_revisions
  for insert with check (editor_id = current_profile_id());

create policy "media_assets_select" on media_assets
  for select using (uploaded_by = current_profile_id() or is_admin());
create policy "media_assets_insert" on media_assets
  for insert with check (uploaded_by = current_profile_id());
create policy "media_assets_delete" on media_assets
  for delete using (uploaded_by = current_profile_id() or is_admin());
