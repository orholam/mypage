-- Waitlist vs personal page sites
alter table public.workspaces
  add column if not exists site_kind text not null default 'waitlist';

alter table public.workspaces
  drop constraint if exists workspaces_site_kind_check;

alter table public.workspaces
  add constraint workspaces_site_kind_check
  check (site_kind in ('waitlist', 'personal'));

alter table public.waitlist_pages
  add column if not exists cta_url text not null default '';

-- Public RPC: include site kind + optional outbound CTA for personal pages
-- (Return type changed: must drop before create; CREATE OR REPLACE cannot change OUT params.)
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
  cta_url text
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
    wp.cta_url
  from public.waitlist_pages wp
  join public.workspaces w on w.id = wp.workspace_id
  where wp.slug = p_slug
    and wp.published = true
  limit 1;
$$;

revoke all on function public.get_public_page(text) from public;
grant execute on function public.get_public_page(text) to anon, authenticated;

-- Only collect emails on waitlist-type workspaces
drop policy if exists "Public insert submissions on published pages" on public.waitlist_submissions;

create policy "Public insert submissions on published waitlists"
on public.waitlist_submissions
for insert
to anon, authenticated
with check (
  exists (
    select 1
    from public.waitlist_pages wp
    join public.workspaces w on w.id = wp.workspace_id
    where wp.id = page_id
      and wp.published = true
      and w.site_kind = 'waitlist'
  )
);
