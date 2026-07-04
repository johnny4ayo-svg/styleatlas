alter table reviews enable row level security;
alter table review_photos enable row level security;
alter table review_reports enable row level security;

-- Only published reviews are public. Authors see their own regardless of
-- status; professionals/staff/admins see all reviews on their listing so
-- they can prepare replies while pending moderation.
create policy "reviews_select" on reviews
  for select using (
    status = 'published'
    or customer_id = current_profile_id()
    or can_manage_professional_account(professional_account_id, 'reviews')
  );

create policy "reviews_customer_insert" on reviews
  for insert with check (customer_id = current_profile_id());

-- Customers may edit their own review within a limited window (enforced
-- in the application layer / submit-review Edge Function); professionals
-- may only update the reply columns, which the check below cannot
-- distinguish at the row level, so reply-writing goes through the
-- submit-review Edge Function using the service role instead.
create policy "reviews_customer_update_own" on reviews
  for update using (customer_id = current_profile_id())
  with check (customer_id = current_profile_id());

create policy "reviews_admin_update" on reviews
  for update using (is_admin()) with check (is_admin());

create policy "reviews_admin_delete" on reviews
  for delete using (is_admin());

create policy "review_photos_select" on review_photos
  for select using (
    status = 'active'
    or exists (
      select 1 from reviews r
      where r.id = review_photos.review_id
        and (r.customer_id = current_profile_id() or can_manage_professional_account(r.professional_account_id, 'reviews'))
    )
  );

create policy "review_photos_customer_insert" on review_photos
  for insert with check (
    exists (select 1 from reviews r where r.id = review_id and r.customer_id = current_profile_id())
  );

create policy "review_photos_admin_moderate" on review_photos
  for update using (is_admin()) with check (is_admin());
create policy "review_photos_admin_delete" on review_photos
  for delete using (is_admin());

create policy "review_reports_insert" on review_reports
  for insert with check (reported_by = current_profile_id());
create policy "review_reports_select" on review_reports
  for select using (reported_by = current_profile_id() or is_admin());
create policy "review_reports_admin_update" on review_reports
  for update using (is_admin()) with check (is_admin());
