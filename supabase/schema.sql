-- ALMA DE NOMADA - Store schema (products + orders)
-- Run this in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  short_description text,
  description text,
  image_url text not null,
  gallery_images text[] default '{}',
  price_cents integer not null check (price_cents > 0),
  currency text not null default 'EUR',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text not null unique,
  stripe_payment_intent text,
  customer_email text,
  status text not null default 'pending' check (status in ('pending', 'paid', 'cancelled', 'refunded', 'expired')),
  total_cents integer not null default 0,
  currency text not null default 'EUR',
  items jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_active_idx on public.products(active);
create index if not exists products_slug_idx on public.products(slug);
create index if not exists orders_created_idx on public.orders(created_at desc);
create index if not exists orders_status_idx on public.orders(status);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_products_touch_updated_at on public.products;
create trigger trg_products_touch_updated_at
before update on public.products
for each row execute function public.touch_updated_at();

drop trigger if exists trg_orders_touch_updated_at on public.orders;
create trigger trg_orders_touch_updated_at
before update on public.orders
for each row execute function public.touch_updated_at();

alter table public.products enable row level security;
alter table public.orders enable row level security;

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products
for select
using (active = true);

drop policy if exists "No public order access" on public.orders;
create policy "No public order access"
on public.orders
for select
using (false);
