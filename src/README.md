# Senbon Zakura Webshop

## Installation
1. Kopiera detta repo
2. Kör `npm install`
3. Kör `npm run dev`
4. Öppna `http://localhost:5173`

## Funktioner
- Produktlista från DummyJSON API
- Sök med debounce med 500ms fördröjning
- Varukorg
- Orderöversikt
- React Router navigering

## Debounce
Jag använde setTimeout och clearTimeout inuti useEffect för att vänta 500ms efter att användaren slutat skriva innan en sökförfrågan skickas.

## Felhantering
Jag använde try/catch inuti useEffect när jag hämtade produkter. Om begäran misslyckas visas ett felmeddelande för användaren.