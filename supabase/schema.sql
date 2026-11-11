-- =========================================================
-- Senbon Zakura: databas för Supabase
-- Kör hela filen i Supabase → SQL Editor → New query → Run
-- =========================================================

-- Row Level Security (RLS) = regler för vad besökare får göra.
-- Webbläsaren använder den publika "anon"-nyckeln, så ALLT som inte
-- uttryckligen tillåts nedan är förbjudet. Det är din säkerhet.

-- ===== Recensioner: alla får läsa och skriva =====
create table if not exists reviews (
  id bigint generated always as identity primary key,
  product_id text not null,
  name text not null check (char_length(name) between 2 and 60),
  rating int not null check (rating between 1 and 5),
  body text not null check (char_length(body) between 10 and 2000),
  created_at timestamptz not null default now()
);
create index if not exists reviews_product_idx on reviews (product_id, created_at desc);
alter table reviews enable row level security;
create policy "Alla kan läsa recensioner" on reviews for select using (true);
create policy "Alla kan skriva recensioner" on reviews for insert with check (true);

-- ===== Nyhetsbrev: alla får anmäla sig, INGEN får läsa listan =====
create table if not exists newsletter (
  email text primary key check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  created_at timestamptz not null default now()
);
alter table newsletter enable row level security;
create policy "Alla kan anmäla sig" on newsletter for insert with check (true);

-- ===== Ordrar: alla får skapa, INGEN får läsa (bara du i Supabase-panelen) =====
create table if not exists orders (
  id bigint generated always as identity primary key,
  number text unique not null,
  name text not null,
  email text not null,
  address text not null,
  items jsonb not null,
  subtotal numeric(10, 2) not null,
  shipping numeric(10, 2) not null,
  total numeric(10, 2) not null,
  status text not null default 'ny',
  created_at timestamptz not null default now()
);
alter table orders enable row level security;
create policy "Alla kan skapa ordrar" on orders for insert with check (true);

-- OBS: priserna i en order kommer från webbläsaren och går att fuska med.
-- Det är okej utan betalning. När betalning läggs till måste priset
-- räknas om på servern (t.ex. i en Supabase Edge Function med Stripe).
