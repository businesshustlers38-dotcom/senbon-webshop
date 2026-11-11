# Senbon Zakura Webshop

En premium-butik för vardagsprodukter (kropp, ansikte, doft, hem, presentset) byggd med React + Vite.

## Kom igång
```bash
npm install
npm run dev
```
Öppna `http://localhost:5173`. Sidan fungerar direkt i **demo-läge** (allt sparas i webbläsaren).

## Sidor
| URL | Sida |
|---|---|
| `/` | Startsida: hero, ritualer, berättelse, butik |
| `/ritualer`, `/ritualer/:slug` | Alla ritualer, en ritual med rutin |
| `/produkt/:id` | Produktsida (presentset visar innehåll och besparing) |
| `/hitta-din-ritual` | Quiz med 3 frågor |
| `/om-oss` | Om oss |
| `/kassa` | Kassa |

## Struktur
| Fil | Ansvar |
|---|---|
| `data/catalog.js` | Produkter, ritualer, kategorier, presentset (SEK) |
| `api.js` | Läser produktdata (byts mot riktig backend senare) |
| `backend.js` | Sparar recensioner, nyhetsbrev och ordrar: Supabase eller localStorage |
| `CartProvider.jsx` + `cartContext.js` | Kundvagnen: useReducer, antal, localStorage |
| `format.js` | Prisformat (kr) och fraktregler |
| `ProductImage.jsx` | SVG-illustrationer, eller riktigt foto om `image` finns |
| `App.css` | Designsystemet, alla färger och typsnitt i `:root` |

## Koppla in Supabase + Stripe (riktig databas och betalning)
Utan detta körs sidan i demo-läge: allt sparas i webbläsaren och ingen betalning sker.

```
Webbläsare ── {id, antal} ──► create-checkout (server) ── riktiga priser ──► Stripe betalsida
                                   │ sparar order "väntar"                        │
                                   ▼                                              ▼
                               orders-tabell ◄──── "betald" ──── stripe-webhook ◄─┘
```

### Steg 1: Supabase (databasen)
1. Skapa ett gratis konto på supabase.com → **New project**
2. **SQL Editor → New query**: klistra in `supabase/schema.sql` → **Run**
3. Ny query: klistra in `supabase/products.sql` → **Run** (lägger in alla priser)
4. **Project Settings → API**: kopiera *Project URL* och *anon public key*
5. Kopiera `.env.example` till `.env` och fyll i de två värdena

### Steg 2: Stripe (betalningen), i TESTLÄGE
1. Skapa konto på stripe.com. Låt **Test mode** vara på (inga riktiga pengar)
2. **Developers → API keys**: kopiera *Secret key* (börjar med `sk_test_`)
3. **Settings → Payment methods**: slå på Klarna och Apple Pay om du vill

### Steg 3: Deploya serverfunktionerna
Kör i terminalen i projektmappen (byt ut `<projekt-ref>` mot ID:t i din Supabase-URL):
```bash
npx supabase login
npx supabase link --project-ref <projekt-ref>
npx supabase secrets set STRIPE_SECRET_KEY=sk_test_... SITE_URL=http://localhost:5173
npx supabase functions deploy create-checkout
npx supabase functions deploy stripe-webhook --no-verify-jwt
```

### Steg 4: Webhook (så ordern markeras som betald)
1. Stripe → **Developers → Webhooks → Add endpoint**
2. URL: `https://<projekt-ref>.supabase.co/functions/v1/stripe-webhook`
3. Händelser: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`
4. Kopiera *Signing secret* (`whsec_...`) och kör:
   `npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...`

### Steg 5: Testa
Starta om `npm run dev`, lägg något i kassen och betala med testkortet
`4242 4242 4242 4242`, valfritt framtida datum och valfri CVC.
Kolla sedan Supabase → **Table Editor → orders**: status ska vara `betald`.

### Säkerhetsregler (läs!)
- `anon`-nyckeln får finnas i `.env` (den är publik). `service_role` och `sk_`-nycklar ALDRIG i `.env` eller i koden, bara i `supabase secrets`.
- Ändrar du ett pris i `catalog.js`: kör `npm run db:products` och kör `supabase/products.sql` igen. Annars tar Stripe det gamla priset.
- Prislogiken testas med `npm run test:pricing`.
- Innan du tar riktiga pengar: byt till live-nycklar i Stripe, sätt `SITE_URL` till din riktiga domän, och läs på om moms, köpvillkor och ångerrätt (distansavtalslagen).

## Adminsidan (/admin)
Översikt (försäljning, snittorder, att skicka, mest sålda), ordrar med status, moderering av recensioner
och nyhetsbrevslistan med CSV-export. Sidan är inte länkad i menyn och har `noindex`.

- **Demo-läge:** öppnas direkt och visar data från din egen webbläsare.
- **Med Supabase:** kräver inloggning. Gör dig själv till admin:
  1. Supabase → **Authentication → Users → Add user** (e-post + starkt lösenord)
  2. Kopiera användarens **User UID**
  3. SQL Editor: `insert into admins (user_id) values ('din-user-uid');`

Säkerhet: inloggningen i React är bara en dörr. Låset är RLS i `schema.sql`, så även om någon
hittar `/admin` får de inte se en enda order utan att stå i tabellen `admins`.
Admin kan bara ändra kolumnen `status` på en order, aldrig priser eller kunduppgifter.

## Byta till riktiga produktfoton
1. Fotografera alla produkter på samma sätt: samma ljusa bakgrund, samma vinkel, dagsljus från sidan
2. Beskär till **4:5 (t.ex. 1200 × 1500 px)**, produkten centrerad med luft runt om
3. Spara som `.webp` eller `.jpg` under 200 kB i `public/products/`, t.ex. `hinoki-candle.webp`
4. Lägg till på produkten i `catalog.js`: `image: '/products/hinoki-candle.webp',`

Produkter utan `image` visar fortfarande illustrationen, så du kan byta en i taget.

## Lägga till en produkt
Kopiera ett objekt i `PRODUCTS` i `data/catalog.js`, ge det ett unikt `id` och ändra texterna.
Presentset: sätt `category: 'gift'`, `shape: 'box'` och `contents: ['id-1', 'id-2']`.
