-- SECURITY FIX: profiles_update_own (migration 0023) allows a user to
-- update any column on their own row, since RLS only checks row
-- ownership (auth_user_id = auth.uid()), not which columns changed.
-- That means, unguarded, a normal customer could currently run:
--   supabase.from('profiles').update({ role: 'admin' }).eq('id', myId)
-- from the browser and RLS would allow it — a full privilege escalation
-- to admin, since every is_admin() check in the app reads this column.
--
-- Column-level ACLs aren't expressible in a USING/WITH CHECK clause, so
-- this is enforced with a trigger instead: non-admins may update their
-- own row freely, EXCEPT the role and status columns, which only an
-- admin (via the separate profiles_update_admin policy) may change.
create or replace function guard_profiles_self_update()
returns trigger
language plpgsql
as $$
begin
  if is_admin() then
    return new;
  end if;

  if new.role is distinct from old.role then
    raise exception 'Only an admin can change a profile''s role';
  end if;

  if new.status is distinct from old.status then
    raise exception 'Only an admin can change a profile''s status';
  end if;

  return new;
end;
$$;

create trigger profiles_guard_self_update
  before update on profiles
  for each row execute function guard_profiles_self_update();
