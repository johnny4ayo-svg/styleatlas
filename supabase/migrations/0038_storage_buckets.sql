-- Upload path convention (enforced by policy, not just documentation):
--   public-profile-images        {profile_id}/{filename}
--   portfolio-images             {professional_account_id}/{filename}
--   outfit-inspiration           {professional_account_id-or-'admin'}/{filename}
--   blog-media                   {author_profile_id}/{filename}
--   review-photos                {review_id}/{filename}
--   event-images                 {professional_account_id-or-'admin'}/{filename}
--   job-attachments              {job_id}/{filename}                (PRIVATE)
--   private-verification-documents  {professional_account_id}/{filename}  (PRIVATE)

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('public-profile-images', 'public-profile-images', true, 5242880, array['image/jpeg','image/png','image/webp','image/avif']),
  ('portfolio-images', 'portfolio-images', true, 8388608, array['image/jpeg','image/png','image/webp','image/avif']),
  ('outfit-inspiration', 'outfit-inspiration', true, 8388608, array['image/jpeg','image/png','image/webp','image/avif']),
  ('blog-media', 'blog-media', true, 10485760, array['image/jpeg','image/png','image/webp','image/avif','video/mp4']),
  ('review-photos', 'review-photos', true, 5242880, array['image/jpeg','image/png','image/webp']),
  ('event-images', 'event-images', true, 8388608, array['image/jpeg','image/png','image/webp']),
  ('job-attachments', 'job-attachments', false, 5242880, array['application/pdf','image/jpeg','image/png']),
  ('private-verification-documents', 'private-verification-documents', false, 10485760, array['application/pdf','image/jpeg','image/png'])
on conflict (id) do nothing;

-- ── public-profile-images ───────────────────────────────────────────────
create policy "profile_images_public_read" on storage.objects
  for select using (bucket_id = 'public-profile-images');
create policy "profile_images_owner_insert" on storage.objects
  for insert with check (
    bucket_id = 'public-profile-images'
    and (storage.foldername(name))[1] = current_profile_id()::text
  );
create policy "profile_images_owner_update" on storage.objects
  for update using (
    bucket_id = 'public-profile-images'
    and ((storage.foldername(name))[1] = current_profile_id()::text or is_admin())
  );
create policy "profile_images_owner_delete" on storage.objects
  for delete using (
    bucket_id = 'public-profile-images'
    and ((storage.foldername(name))[1] = current_profile_id()::text or is_admin())
  );

-- ── portfolio-images ─────────────────────────────────────────────────────
create policy "portfolio_images_public_read" on storage.objects
  for select using (bucket_id = 'portfolio-images');
create policy "portfolio_images_owner_insert" on storage.objects
  for insert with check (
    bucket_id = 'portfolio-images'
    and can_manage_professional_account((storage.foldername(name))[1]::uuid, 'gallery')
  );
create policy "portfolio_images_owner_delete" on storage.objects
  for delete using (
    bucket_id = 'portfolio-images'
    and (can_manage_professional_account((storage.foldername(name))[1]::uuid, 'gallery') or is_admin())
  );

-- ── outfit-inspiration ───────────────────────────────────────────────────
create policy "outfit_inspiration_public_read" on storage.objects
  for select using (bucket_id = 'outfit-inspiration');
create policy "outfit_inspiration_curator_insert" on storage.objects
  for insert with check (
    bucket_id = 'outfit-inspiration'
    and (is_admin() or can_manage_professional_account((storage.foldername(name))[1]::uuid, 'gallery'))
  );
create policy "outfit_inspiration_curator_delete" on storage.objects
  for delete using (bucket_id = 'outfit-inspiration' and is_admin());

-- ── blog-media ───────────────────────────────────────────────────────────
create policy "blog_media_public_read" on storage.objects
  for select using (bucket_id = 'blog-media');
create policy "blog_media_editorial_insert" on storage.objects
  for insert with check (
    bucket_id = 'blog-media'
    and (storage.foldername(name))[1] = current_profile_id()::text
    and current_role_name() in ('admin', 'super_admin')
  );
create policy "blog_media_admin_delete" on storage.objects
  for delete using (bucket_id = 'blog-media' and is_admin());

-- ── review-photos ────────────────────────────────────────────────────────
create policy "review_photos_public_read" on storage.objects
  for select using (bucket_id = 'review-photos');
create policy "review_photos_customer_insert" on storage.objects
  for insert with check (
    bucket_id = 'review-photos'
    and exists (
      select 1 from reviews r where r.id = (storage.foldername(name))[1]::uuid and r.customer_id = current_profile_id()
    )
  );
create policy "review_photos_admin_delete" on storage.objects
  for delete using (bucket_id = 'review-photos' and is_admin());

-- ── event-images ─────────────────────────────────────────────────────────
create policy "event_images_public_read" on storage.objects
  for select using (bucket_id = 'event-images');
create policy "event_images_owner_insert" on storage.objects
  for insert with check (
    bucket_id = 'event-images'
    and (is_admin() or can_manage_professional_account((storage.foldername(name))[1]::uuid, 'events'))
  );
create policy "event_images_owner_delete" on storage.objects
  for delete using (
    bucket_id = 'event-images'
    and (is_admin() or can_manage_professional_account((storage.foldername(name))[1]::uuid, 'events'))
  );

-- ── job-attachments (PRIVATE — resumes/cover letters) ───────────────────
create policy "job_attachments_insert" on storage.objects
  for insert with check (bucket_id = 'job-attachments');
create policy "job_attachments_select" on storage.objects
  for select using (
    bucket_id = 'job-attachments'
    and (
      is_admin()
      or exists (
        select 1 from jobs j
        where j.id = (storage.foldername(name))[1]::uuid
          and j.professional_account_id is not null
          and can_manage_professional_account(j.professional_account_id, 'jobs')
      )
    )
  );
create policy "job_attachments_admin_delete" on storage.objects
  for delete using (bucket_id = 'job-attachments' and is_admin());

-- ── private-verification-documents (PRIVATE) ────────────────────────────
create policy "verification_documents_bucket_select" on storage.objects
  for select using (
    bucket_id = 'private-verification-documents'
    and (is_admin() or can_manage_professional_account((storage.foldername(name))[1]::uuid, 'profile_editing'))
  );
create policy "verification_documents_bucket_insert" on storage.objects
  for insert with check (
    bucket_id = 'private-verification-documents'
    and can_manage_professional_account((storage.foldername(name))[1]::uuid, 'profile_editing')
  );
create policy "verification_documents_bucket_delete" on storage.objects
  for delete using (bucket_id = 'private-verification-documents' and is_admin());
