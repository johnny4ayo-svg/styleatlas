-- Homepage fashion-request form allows visitors to submit a lead with only
-- a WhatsApp number (email marked optional in the UI), so the leads table
-- must accept a null email rather than requiring one.
alter table leads alter column email drop not null;
