-- ── RLS helper functions ────────────────────────────────────────────────
-- SECURITY DEFINER + a pinned search_path so these can be called from
-- inside policy expressions without exposing a privilege-escalation path
-- (they only ever read, never write).

create or replace function current_profile_id()
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select id from profiles where auth_user_id = auth.uid();
$$;

create or replace function current_role_name()
returns user_role
language sql
security definer
stable
set search_path = public
as $$
  select role from profiles where auth_user_id = auth.uid();
$$;

create or replace function is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from profiles where auth_user_id = auth.uid() and role in ('admin', 'super_admin')
  );
$$;

create or replace function is_super_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from profiles where auth_user_id = auth.uid() and role = 'super_admin'
  );
$$;

create or replace function owns_professional_account(p_account_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from professional_accounts pa
    join profiles p on p.id = pa.owner_id
    where pa.id = p_account_id and p.auth_user_id = auth.uid()
  );
$$;

create or replace function has_staff_permission(p_account_id uuid, p_permission text)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from professional_staff ps
    join profiles p on p.id = ps.user_id
    where ps.professional_account_id = p_account_id
      and p.auth_user_id = auth.uid()
      and ps.status = 'active'
      and ps.permissions ? p_permission
  );
$$;

-- True if the caller owns the account OR is active staff with the given
-- permission OR is an admin. This is the single check most policies use.
create or replace function can_manage_professional_account(p_account_id uuid, p_permission text default null)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select is_admin()
    or owns_professional_account(p_account_id)
    or (p_permission is not null and has_staff_permission(p_account_id, p_permission));
$$;
