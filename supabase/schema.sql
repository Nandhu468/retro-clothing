-- ============================================================
-- RETRO CLOTHING — Supabase schema, RLS policies, storage setup
-- Run this once in the Supabase SQL editor (Project > SQL Editor)
-- ============================================================

-- Extensions
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- 1. PRODUCTS TABLE
-- ------------------------------------------------------------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category text not null check (category in ('shirts', 't-shirts', 'pants')),
  price numeric(10,2) not null check (price >= 0),
  description text,
  images jsonb not null default '[]',        -- [{url, path, is_primary, sort}]
  sizes jsonb not null default '[]',          -- ["S","M","L","XL"]
  stock integer not null default 0 check (stock >= 0),
  featured boolean not null default false,
  new_arrival boolean not null default false,
  published boolean not null default true,
  fabric text,
  fit text,
  care text,
  sku text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on products (category);
create index if not exists products_published_idx on products (published);
create index if not exists products_featured_idx on products (featured) where featured = true;
create index if not exists products_new_arrival_idx on products (new_arrival) where new_arrival = true;

-- Full text search
alter table products add column if not exists search_vector tsvector
  generated always as (
    to_tsvector('english', coalesce(name,'') || ' ' || coalesce(category,'') || ' ' || coalesce(description,''))
  ) stored;
create index if not exists products_search_idx on products using gin (search_vector);

-- keep updated_at fresh
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_products_updated_at on products;
create trigger trg_products_updated_at
before update on products
for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- 2. ADMINS TABLE  (authorization allow-list; NOT every auth user is an admin)
-- ------------------------------------------------------------
create table if not exists admins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now()
);

-- helper: is the current JWT user an authorized admin?
create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from admins where user_id = auth.uid()
  );
$$;

-- helper: does the current session satisfy MFA (aal2)?
-- Supabase exposes the assurance level via auth.jwt() ->> 'aal'
create or replace function has_mfa()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() ->> 'aal') = 'aal2', false);
$$;

-- ------------------------------------------------------------
-- 3. ROW LEVEL SECURITY
-- ------------------------------------------------------------
alter table products enable row level security;
alter table admins enable row level security;

-- Public (anon + authenticated) can read published products
drop policy if exists "public read published products" on products;
create policy "public read published products"
  on products for select
  using (published = true);

-- Admins (must be in admins table AND have completed TOTP MFA) can read everything
drop policy if exists "admin read all products" on products;
create policy "admin read all products"
  on products for select
  using (is_admin() and has_mfa());

drop policy if exists "admin insert products" on products;
create policy "admin insert products"
  on products for insert
  with check (is_admin() and has_mfa());

drop policy if exists "admin update products" on products;
create policy "admin update products"
  on products for update
  using (is_admin() and has_mfa())
  with check (is_admin() and has_mfa());

drop policy if exists "admin delete products" on products;
create policy "admin delete products"
  on products for delete
  using (is_admin() and has_mfa());

-- admins table: nobody can read/write it via the client except a user reading their own row
drop policy if exists "self read admin row" on admins;
create policy "self read admin row"
  on admins for select
  using (user_id = auth.uid());
-- No insert/update/delete policies for admins table on purpose:
-- new admins must be added manually via SQL editor / service role, never from the client.

-- ------------------------------------------------------------
-- 4. STORAGE — product-images bucket
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Public can view images (bucket is public, but keep an explicit read policy too)
drop policy if exists "public read product images" on storage.objects;
create policy "public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Only authorized, MFA-verified admins may upload/replace/delete
drop policy if exists "admin write product images" on storage.objects;
create policy "admin write product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and is_admin() and has_mfa());

drop policy if exists "admin update product images" on storage.objects;
create policy "admin update product images"
  on storage.objects for update
  using (bucket_id = 'product-images' and is_admin() and has_mfa());

drop policy if exists "admin delete product images" on storage.objects;
create policy "admin delete product images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and is_admin() and has_mfa());

-- ------------------------------------------------------------
-- 5. FIRST ADMIN
-- ------------------------------------------------------------
-- 1) Create the owner's login in Authentication > Users (email + password), or via sign-up in the app.
-- 2) Then run, substituting the user's UUID from that Users table:
--
--    insert into admins (user_id, role) values ('PASTE-USER-UUID-HERE', 'admin');
--
-- Only rows manually inserted here can ever reach /admin.
