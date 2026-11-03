-- Rivera menu: schema, row level security and image storage.
-- The public (anon) role reads only what is visible; the single admin account
-- (any authenticated user, since sign-up is disabled) can read and write everything.

create table public.settings (
  id boolean primary key default true check (id),
  logo_path text,
  phone text not null default '0590000000',
  address text not null default 'غزة',
  hours_text text not null default 'يومياً 9 صباحاً – 12 منتصف الليل',
  instagram_url text,
  facebook_url text,
  extra_links jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);
insert into public.settings default values;

create table public.sections (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null check (length(trim(name_ar)) > 0),
  name_en text,
  icon text not null,
  sort_order int not null default 0,
  is_hidden boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.items (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.sections (id) on delete cascade,
  name_ar text not null check (length(trim(name_ar)) > 0),
  name_en text,
  desc_ar text,
  desc_en text,
  -- Null means "حسب الطلب". Ignored when the item has sizes.
  price numeric(8, 2) check (price >= 0),
  image_path text,
  sort_order int not null default 0,
  is_hidden boolean not null default false,
  is_unavailable boolean not null default false,
  created_at timestamptz not null default now()
);
create index items_section_idx on public.items (section_id, sort_order);

create table public.item_sizes (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items (id) on delete cascade,
  name_ar text not null check (length(trim(name_ar)) > 0),
  name_en text,
  price numeric(8, 2) not null check (price >= 0),
  sort_order int not null default 0
);
create index item_sizes_item_idx on public.item_sizes (item_id, sort_order);

create table public.item_flavors (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items (id) on delete cascade,
  name_ar text not null check (length(trim(name_ar)) > 0),
  name_en text,
  sort_order int not null default 0
);
create index item_flavors_item_idx on public.item_flavors (item_id, sort_order);

-- Visibility helper used by the public policies.
create function public.item_is_public(p_item uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from items i join sections s on s.id = i.section_id
    where i.id = p_item and not i.is_hidden and not s.is_hidden
  );
$$;

alter table public.settings enable row level security;
alter table public.sections enable row level security;
alter table public.items enable row level security;
alter table public.item_sizes enable row level security;
alter table public.item_flavors enable row level security;

create policy "public reads settings" on public.settings for select to anon using (true);
create policy "public reads visible sections" on public.sections for select to anon using (not is_hidden);
create policy "public reads visible items" on public.items for select to anon using (public.item_is_public(id));
create policy "public reads visible sizes" on public.item_sizes for select to anon using (public.item_is_public(item_id));
create policy "public reads visible flavors" on public.item_flavors for select to anon using (public.item_is_public(item_id));

create policy "admin manages settings" on public.settings for all to authenticated using (true) with check (true);
create policy "admin manages sections" on public.sections for all to authenticated using (true) with check (true);
create policy "admin manages items" on public.items for all to authenticated using (true) with check (true);
create policy "admin manages sizes" on public.item_sizes for all to authenticated using (true) with check (true);
create policy "admin manages flavors" on public.item_flavors for all to authenticated using (true) with check (true);

-- Images: public to read, only the admin uploads. Files are already WebP-compressed in the browser.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('menu-images', 'menu-images', true, 2097152, array['image/webp', 'image/png', 'image/svg+xml', 'image/jpeg']);

create policy "admin uploads images" on storage.objects for insert to authenticated with check (bucket_id = 'menu-images');
create policy "admin updates images" on storage.objects for update to authenticated using (bucket_id = 'menu-images');
create policy "admin deletes images" on storage.objects for delete to authenticated using (bucket_id = 'menu-images');
