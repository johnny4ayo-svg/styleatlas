alter table jobs enable row level security;
alter table job_applications enable row level security;
alter table events enable row level security;

create policy "jobs_public_read" on jobs
  for select using (
    status = 'active'
    or is_admin()
    or (professional_account_id is not null and can_manage_professional_account(professional_account_id, 'jobs'))
  );

create policy "jobs_owner_insert" on jobs
  for insert with check (
    is_admin()
    or (
      professional_account_id is not null
      and can_manage_professional_account(professional_account_id, 'jobs')
      and can_post_job(professional_account_id)
    )
  );

create policy "jobs_owner_update" on jobs
  for update using (
    is_admin() or (professional_account_id is not null and can_manage_professional_account(professional_account_id, 'jobs'))
  )
  with check (
    is_admin() or (professional_account_id is not null and can_manage_professional_account(professional_account_id, 'jobs'))
  );

create policy "jobs_owner_delete" on jobs
  for delete using (
    is_admin() or (professional_account_id is not null and can_manage_professional_account(professional_account_id, 'jobs'))
  );

create policy "job_applications_select" on job_applications
  for select using (
    user_id = current_profile_id()
    or is_admin()
    or exists (
      select 1 from jobs j
      where j.id = job_applications.job_id
        and j.professional_account_id is not null
        and can_manage_professional_account(j.professional_account_id, 'jobs')
    )
  );

create policy "job_applications_insert" on job_applications
  for insert with check (true);

create policy "job_applications_owner_update_status" on job_applications
  for update using (
    is_admin()
    or exists (
      select 1 from jobs j
      where j.id = job_applications.job_id
        and j.professional_account_id is not null
        and can_manage_professional_account(j.professional_account_id, 'jobs')
    )
  );

create policy "events_public_read" on events
  for select using (
    status = 'active'
    or is_admin()
    or (professional_account_id is not null and can_manage_professional_account(professional_account_id, 'events'))
  );

create policy "events_owner_insert" on events
  for insert with check (
    is_admin()
    or (professional_account_id is not null and can_manage_professional_account(professional_account_id, 'events'))
  );

create policy "events_owner_update" on events
  for update using (
    is_admin() or (professional_account_id is not null and can_manage_professional_account(professional_account_id, 'events'))
  )
  with check (
    is_admin() or (professional_account_id is not null and can_manage_professional_account(professional_account_id, 'events'))
  );

create policy "events_owner_delete" on events
  for delete using (
    is_admin() or (professional_account_id is not null and can_manage_professional_account(professional_account_id, 'events'))
  );
