# Senbon Zakura Webshop

En premium-butik för vardagsprodukter (hudvård, skönhet, doft, hem) byggd med React + Vite.

## Installation
1. `npm install`
2. `npm run dev`
3. Öppna `http://localhost:5173`

## Struktur
| Fil | Ansvar |
|---|---|
| `api.js` | All kommunikation med DummyJSON (kategorier, felhantering, avbrytning) |
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

## Felhantering
`api.js` kollar `res.ok` för alla anrop. Produktlistan har en "Try again"-knapp
och produktsidan visar ett fel om produkten inte finns.

## Nästa steg
- Betalning med Stripe Checkout (kräver en liten backend, t.ex. Vercel-funktion)
