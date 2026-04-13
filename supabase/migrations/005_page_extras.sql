-- Rich page content: profile links (personal) + pitch blocks (waitlist), stored as JSON.

alter table public.waitlist_pages
  add column if not exists extras jsonb not null default '{}'::jsonb;

drop function if exists public.get_public_page(text);

create function public.get_public_page(p_slug text)
returns table (
  id uuid,
  slug text,
  headline text,
  subheadline text,
  cta_label text,
  template_id text,
  site_kind text,
  cta_url text,
  extras jsonb
)
language sql
stable
security definer
set search_path = public
as $$
  select
    wp.id,
    wp.slug,
    wp.headline,
    wp.subheadline,
    wp.cta_label,
    wp.template_id,
    w.site_kind,
    wp.cta_url,
    wp.extras
  from public.waitlist_pages wp
  join public.workspaces w on w.id = wp.workspace_id
  where wp.slug = p_slug
    and wp.published = true
  limit 1;
$$;

revoke all on function public.get_public_page(text) from public;
grant execute on function public.get_public_page(text) to anon, authenticated;

create or replace function public.get_public_site_by_subdomain(p_subdomain text)
returns table (
  id uuid,
  slug text,
  headline text,
  subheadline text,
  cta_label text,
  template_id text,
  site_kind text,
  cta_url text,
  extras jsonb
)
language sql
stable
security definer
set search_path = public
as $$
  select
    wp.id,
    wp.slug,
    wp.headline,
    wp.subheadline,
    wp.cta_label,
    wp.template_id,
    w.site_kind,
    wp.cta_url,
    wp.extras
  from public.waitlist_pages wp
  join public.workspaces w on w.id = wp.workspace_id
  where lower(w.subdomain) = lower(trim(p_subdomain))
    and wp.published = true
  order by wp.created_at asc
  limit 1;
$$;

revoke all on function public.get_public_site_by_subdomain(text) from public;
grant execute on function public.get_public_site_by_subdomain(text) to anon, authenticated;
