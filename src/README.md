# Senbon Zakura Webshop

En premium-butik för vardagsprodukter (hudvård, skönhet, doft, hem) byggd med React + Vite.

## Installation
1. `npm install`
2. `npm run dev`
3. Öppna `http://localhost:5173`

## Struktur
| Fil | Ansvar |
|---|---|
| `data/catalog.js` | Butikens egna produkter, ritualer och kategorier (priser i SEK) |
| `api.js` | Den enda dörren till datan, async så den kan bytas mot en riktig backend |
| `ProductImage.jsx` | SVG-illustrationer i ritualens färger (byts mot foton via `image`) |
| `ProductCard.jsx` | Produktkort som återanvänds överallt |
| `Rituals.jsx` / `RitualPage.jsx` | Shoppa per ritual, med steg-för-steg-rutin |
| `Reviews.jsx` + `useReviews.js` | Recensioner med stjärnor (sparas i webbläsaren) |
| `Hero.jsx` / `Story.jsx` / `Footer.jsx` | Startsidans hero med kronblad, berättelse, nyhetsbrev |
| `CartProvider.jsx` + `cartContext.js` | Kundvagnen: useReducer, antal, localStorage |
| `format.js` | Prisformat med Intl.NumberFormat |
| `Producklista.jsx` / `Sökfält.jsx` | Butiken, kategorifilter, sök med debounce |
| `Produktside.jsx` | Produktsida med galleri och antal |
| `Cart.jsx` | Kundvagnslåda som glider in från höger |
| `Orderssida.jsx` | Kassa med validering och frakt |
| `App.css` | Designsystemet, alla färger/typsnitt är variabler i `:root` |

## Debounce
Sökrutan väntar 300ms efter sista tangenttrycket innan listan filtreras lokalt.
Det gör att listan inte ritas om vid varje bokstav. (Inget API-anrop görs vid sökning.)

## Lägga till en produkt
Kopiera ett objekt i `PRODUCTS` i `data/catalog.js`, ge det ett unikt `id` och ändra texterna.
Riktigt foto: lägg bilden i `public/` och skriv `image: '/bild.jpg'` på produkten.

## Felhantering
Produktsidan och ritualsidan visar ett tydligt fel om produkten/ritualen inte finns.

## Nästa steg
- Betalning med Stripe Checkout (kräver en liten backend, t.ex. Vercel-funktion)
