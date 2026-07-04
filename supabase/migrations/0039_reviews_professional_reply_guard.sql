-- Professionals/staff with the 'reviews' permission may update a review
-- row on their own listing (to reply), but RLS alone can't restrict WHICH
-- columns an UPDATE touches — only whether the row qualifies. This
-- trigger enforces the column-level split: a non-owning-customer caller
-- (i.e. the professional side) may only change professional_reply /
-- professional_reply_at; everything else must stay identical unless the
-- caller is the reviewing customer or an admin.
create policy "reviews_professional_reply_update" on reviews
  for update using (can_manage_professional_account(professional_account_id, 'reviews'))
  with check (can_manage_professional_account(professional_account_id, 'reviews'));

create or replace function guard_review_reply_only_update()
returns trigger
language plpgsql
as $$
begin
  -- Admins and the reviewing customer may edit any field (subject to the
  -- application's own edit-window rule for customers).
  if is_admin() or old.customer_id = current_profile_id() then
    return new;
  end if;

  -- Any other caller who reached this row via RLS is necessarily a
  -- professional/staff member managing the account (see policy above).
  -- Lock every column except the reply fields to its previous value.
  if new.rating is distinct from old.rating
    or new.title is distinct from old.title
    or new.body is distinct from old.body
    or new.service_used is distinct from old.service_used
    or new.communication_rating is distinct from old.communication_rating
    or new.quality_rating is distinct from old.quality_rating
    or new.delivery_rating is distinct from old.delivery_rating
    or new.value_rating is distinct from old.value_rating
    or new.status is distinct from old.status
    or new.customer_id is distinct from old.customer_id
    or new.professional_account_id is distinct from old.professional_account_id
  then
    raise exception 'Professionals may only update professional_reply and professional_reply_at';
  end if;

  return new;
end;
$$;

create trigger reviews_guard_reply_only_update
  before update on reviews
  for each row execute function guard_review_reply_only_update();
