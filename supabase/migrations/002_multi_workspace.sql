-- Allow multiple waitlist "sites" per user (one row per product/site).
alter table public.workspaces drop constraint if exists workspaces_owner_unique;
