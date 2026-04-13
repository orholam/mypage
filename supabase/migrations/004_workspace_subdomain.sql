-- Unique subdomain per workspace for {subdomain}.{ROOT} public URLs

alter table public.workspaces
  add column if not exists subdomain text;

-- Backfill from existing page slug (globally unique) or random
update public.workspaces w
set subdomain = (
  select p.slug
  from public.waitlist_pages p
  where p.workspace_id = w.id
  order by p.created_at asc
  limit 1
)
where w.subdomain is null;

update public.workspaces
set subdomain = lower(replace(gen_random_uuid()::text, '-', ''))
where subdomain is null or btrim(subdomain) = '';

alter table public.workspaces
  alter column subdomain set not null;

create unique index if not exists workspaces_subdomain_lower_idx
  on public.workspaces (lower(subdomain));

alter table public.workspaces
  drop constraint if exists workspaces_subdomain_format;

alter table public.workspaces
  add constraint workspaces_subdomain_format
  check (subdomain ~ '^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$');

-- Signup seed: same random key for subdomain + page slug (both unique)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  wid uuid;
  site_key text;
begin
  site_key := lower(replace(gen_random_uuid()::text, '-', ''));

  insert into public.workspaces (owner_id, name, plan_label, subscriber_cap, subdomain)
  values (new.id, 'My Workspace', 'Lifetime', 5000, site_key)
  returning id into wid;

  insert into public.waitlist_pages (
    workspace_id,
    slug,
    template_id,
    headline,
    subheadline,
    cta_label,
    cta_url,
    published
  )
  values (
    wid,
    site_key,
    'basic',
    'Create waitlist in 30 Sec',
    'Experience the Power Now!',
    'Join the Waitlist',
    '',
    true
  );

  insert into public.email_templates (
    workspace_id,
    kind,
    subject,
    header_text,
    body_greeting,
    cta_label,
    cta_url
  )
  values
    (
      wid,
      'welcome',
      'Welcome Here !!',
      'Welcome to LaunchPage!',
      'Hey User!',
      'Access Your Account',
      'https://example.com'
    ),
    (
      wid,
      'launch',
      'We are live!',
      'Launch day!',
      'Hey there!',
      'See what''s new',
      'https://example.com'
    );

  return new;
end;
$$;

-- Resolve published page by workspace subdomain (first page by created_at)
create or replace function public.get_public_site_by_subdomain(p_subdomain text)
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
  where lower(w.subdomain) = lower(trim(p_subdomain))
    and wp.published = true
  order by wp.created_at asc
  limit 1;
$$;

revoke all on function public.get_public_site_by_subdomain(text) from public;
grant execute on function public.get_public_site_by_subdomain(text) to anon, authenticated;
