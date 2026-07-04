alter table verification_requests enable row level security;
alter table verification_documents enable row level security;

-- Verification data is sensitive: only the owning professional/staff and
-- admins may see it. There is no public policy at all.
create policy "verification_requests_select" on verification_requests
  for select using (
    can_manage_professional_account(professional_account_id, 'profile_editing') or is_admin()
  );

create policy "verification_requests_owner_insert" on verification_requests
  for insert with check (can_manage_professional_account(professional_account_id, 'profile_editing'));

create policy "verification_requests_admin_update" on verification_requests
  for update using (is_admin()) with check (is_admin());

-- Documents are private (private-verification-documents bucket + this
-- table). Only the owner/staff who submitted them and admins may read.
create policy "verification_documents_select" on verification_documents
  for select using (
    is_admin()
    or exists (
      select 1 from verification_requests vr
      where vr.id = verification_documents.verification_request_id
        and can_manage_professional_account(vr.professional_account_id, 'profile_editing')
    )
  );

create policy "verification_documents_owner_insert" on verification_documents
  for insert with check (
    exists (
      select 1 from verification_requests vr
      where vr.id = verification_request_id
        and can_manage_professional_account(vr.professional_account_id, 'profile_editing')
    )
  );

create policy "verification_documents_admin_update" on verification_documents
  for update using (is_admin()) with check (is_admin());
