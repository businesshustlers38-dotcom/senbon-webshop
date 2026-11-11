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

## Koppla in Supabase (riktig databas)
Utan detta syns recensioner, prenumerationer och ordrar bara i din egen webbläsare.

1. Skapa ett gratis konto på supabase.com → **New project**
2. Gå till **SQL Editor → New query**, klistra in hela `supabase/schema.sql` och tryck **Run**
3. Gå till **Project Settings → API** och kopiera *Project URL* och *anon public key*
4. Kopiera `.env.example` till `.env` i projektmappen och fyll i värdena
5. Starta om `npm run dev`. I footern står det inte längre "lokalt läge".

Säkerhet: anon-nyckeln är gjord för att vara publik. Reglerna i `schema.sql` (RLS) gör att besökare
bara kan *skriva* ordrar och prenumerationer, aldrig *läsa* andras. Lägg aldrig `service_role`-nyckeln i `.env`.
Dina ordrar ser du i Supabase under **Table Editor → orders**.

## Byta till riktiga produktfoton
1. Fotografera alla produkter på samma sätt: samma ljusa bakgrund, samma vinkel, dagsljus från sidan
2. Beskär till **4:5 (t.ex. 1200 × 1500 px)**, produkten centrerad med luft runt om
3. Spara som `.webp` eller `.jpg` under 200 kB i `public/products/`, t.ex. `hinoki-candle.webp`
4. Lägg till på produkten i `catalog.js`: `image: '/products/hinoki-candle.webp',`

Produkter utan `image` visar fortfarande illustrationen, så du kan byta en i taget.

## Lägga till en produkt
Kopiera ett objekt i `PRODUCTS` i `data/catalog.js`, ge det ett unikt `id` och ändra texterna.
Presentset: sätt `category: 'gift'`, `shape: 'box'` och `contents: ['id-1', 'id-2']`.
