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

-- ===== Produkter: priserna servern räknar med =====
-- Fylls med supabase/products.sql (genereras med: npm run db:products)
create table if not exists products (
  id text primary key,
  name text not null,
  price numeric(10, 2) not null check (price >= 0),
  active boolean not null default true
);
alter table products enable row level security;
-- Inga policies = besökare kan varken läsa eller ändra. Bara Edge Functions (service_role).

-- ===== Ordrar: skapas BARA av Edge Function create-checkout =====
-- Ingen policy för besökare alls. Webbläsaren kan alltså inte skapa,
-- läsa eller ändra ordrar. Det gör att ingen kan fuska med priset.
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
  status text not null default 'väntar på betalning',
  stripe_session_id text,
  created_at timestamptz not null default now()
);
alter table orders enable row level security;

-- =========================================================
-- ADMIN (kör den här delen också)
-- =========================================================
-- Vem som är admin bestäms HÄR i databasen, inte i React-koden.
-- Lägg till dig själv: skapa en användare i Authentication → Users → Add user,
-- kopiera dess User UID och kör:
--   insert into admins (user_id) values ('din-user-uid');

create table if not exists admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);
alter table admins enable row level security;
-- En inloggad användare får bara se om HEN SJÄLV är admin
create policy "Se sin egen admin-rad" on admins for select using (user_id = auth.uid());

-- Hjälpfunktion: är den inloggade användaren admin?
create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from admins where user_id = auth.uid());
$$;

-- Ordrar: admin får läsa och ändra status
create policy "Admin läser ordrar" on orders for select using (is_admin());
create policy "Admin ändrar ordrar" on orders for update using (is_admin()) with check (is_admin());
-- Bara kolumnen status får ändras, inte priser eller kunduppgifter
revoke update on orders from authenticated;
grant update (status) on orders to authenticated;
alter table orders add constraint orders_status_check check (
  status in ('väntar på betalning', 'betalning behandlas', 'betald', 'skickad', 'levererad', 'avbruten', 'betalning misslyckades')
);

-- Nyhetsbrev: admin får läsa listan
create policy "Admin läser nyhetsbrev" on newsletter for select using (is_admin());

-- Recensioner: admin får ta bort (moderering)
create policy "Admin tar bort recensioner" on reviews for delete using (is_admin());
