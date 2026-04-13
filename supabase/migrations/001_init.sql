-- LaunchPage clone: core schema, RLS, signup seed trigger, public page RPC

-- Extensions (gen_random_uuid)
create extension if not exists "pgcrypto";

-- Tables
create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  name text not null default 'My Workspace',
  plan_label text not null default 'Lifetime',
  subscriber_cap integer not null default 5000,
  created_at timestamptz not null default now(),
  constraint workspaces_owner_unique unique (owner_id)
);

create table public.waitlist_pages (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  slug text not null,
  template_id text not null default 'basic',
  headline text not null,
  subheadline text not null,
  cta_label text not null default 'Join the Waitlist',
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint waitlist_pages_slug_unique unique (slug)
);

create index waitlist_pages_workspace_id_idx on public.waitlist_pages (workspace_id);

create table public.waitlist_submissions (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.waitlist_pages (id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

create index waitlist_submissions_page_id_idx on public.waitlist_submissions (page_id);

create table public.email_templates (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  kind text not null,
  subject text not null,
  header_text text not null,
  body_greeting text not null,
  cta_label text not null,
  cta_url text not null default '',
  constraint email_templates_kind_check check (kind in ('welcome', 'launch')),
  constraint email_templates_workspace_kind_unique unique (workspace_id, kind)
);

-- Public read for published pages (no direct table select for anon)
create or replace function public.get_public_page(p_slug text)
returns table (
  id uuid,
  slug text,
  headline text,
  subheadline text,
  cta_label text,
  template_id text
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
    wp.template_id
  from public.waitlist_pages wp
  where wp.slug = p_slug
    and wp.published = true
  limit 1;
$$;

revoke all on function public.get_public_page(text) from public;
grant execute on function public.get_public_page(text) to anon, authenticated;

-- New user: workspace + default page + email templates
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  wid uuid;
  new_slug text;
begin
  insert into public.workspaces (owner_id, name, plan_label, subscriber_cap)
  values (new.id, 'My Workspace', 'Lifetime', 5000)
  returning id into wid;

  new_slug := lower(replace(gen_random_uuid()::text, '-', ''));

  insert into public.waitlist_pages (
    workspace_id,
    slug,
    template_id,
    headline,
    subheadline,
    cta_label,
    published
  )
  values (
    wid,
    new_slug,
    'basic',
    'Create waitlist in 30 Sec',
    'Experience the Power Now!',
    'Join the Waitlist',
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

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();

-- RLS
alter table public.workspaces enable row level security;
alter table public.waitlist_pages enable row level security;
alter table public.waitlist_submissions enable row level security;
alter table public.email_templates enable row level security;

create policy "Users manage own workspaces"
on public.workspaces
for all
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create policy "Owners manage waitlist pages"
on public.waitlist_pages
for all
to authenticated
using (
  exists (
    select 1
    from public.workspaces w
    where w.id = waitlist_pages.workspace_id
      and w.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.workspaces w
    where w.id = waitlist_pages.workspace_id
      and w.owner_id = auth.uid()
  )
);

create policy "Owners manage email templates"
on public.email_templates
for all
to authenticated
using (
  exists (
    select 1
    from public.workspaces w
    where w.id = email_templates.workspace_id
      and w.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.workspaces w
    where w.id = email_templates.workspace_id
      and w.owner_id = auth.uid()
  )
);

create policy "Owners read submissions"
on public.waitlist_submissions
for select
to authenticated
using (
  exists (
    select 1
    from public.waitlist_pages wp
    join public.workspaces w on w.id = wp.workspace_id
    where wp.id = waitlist_submissions.page_id
      and w.owner_id = auth.uid()
  )
);

create policy "Public insert submissions on published pages"
on public.waitlist_submissions
for insert
to anon, authenticated
with check (
  exists (
    select 1
    from public.waitlist_pages wp
    where wp.id = page_id
      and wp.published = true
  )
);

-- Optional: owners may delete spam from their waitlists
create policy "Owners delete submissions"
on public.waitlist_submissions
for delete
to authenticated
using (
  exists (
    select 1
    from public.waitlist_pages wp
    join public.workspaces w on w.id = wp.workspace_id
    where wp.id = waitlist_submissions.page_id
      and w.owner_id = auth.uid()
  )
);
