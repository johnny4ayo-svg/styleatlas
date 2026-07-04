create table verification_requests (
  id uuid primary key default uuid_generate_v4(),
  professional_account_id uuid not null references professional_accounts(id) on delete cascade,
  requested_level verification_level not null,
  status verification_request_status not null default 'pending',
  submitted_data jsonb not null default '{}'::jsonb,
  admin_notes text,
  rejection_reason text,
  reviewed_by uuid references profiles(id),
  reviewed_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index verification_requests_account_idx on verification_requests(professional_account_id);
create index verification_requests_status_idx on verification_requests(status);

create trigger verification_requests_set_updated_at
  before update on verification_requests
  for each row execute function set_updated_at();

-- Documents live in a PRIVATE storage bucket (private-verification-documents).
-- `file_path` is the storage object path, never a public URL.
create table verification_documents (
  id uuid primary key default uuid_generate_v4(),
  verification_request_id uuid not null references verification_requests(id) on delete cascade,
  document_type text not null check (document_type in (
    'business_registration', 'government_id', 'address_proof', 'social_media_proof', 'website_proof', 'other'
  )),
  file_path text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create index verification_documents_request_idx on verification_documents(verification_request_id);
