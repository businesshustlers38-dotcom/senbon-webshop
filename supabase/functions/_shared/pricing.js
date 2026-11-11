/*
  pricing.js Räknar ut ordern PÅ SERVERN

  Ren JavaScript utan beroenden, så samma fil fungerar i Supabase (Deno)
  och kan testas med Node (se scripts/test-pricing.mjs).

  Varför: allt som kommer från webbläsaren kan fuskas med.
  Därför skickar webbläsaren bara { id, qty } och priserna hämtas här från databasen.
*/

export const FREE_SHIPPING_FROM = 499
export const SHIPPING_COST = 49
const MAX_QTY = 20
const MAX_LINES = 30

// items: [{ id, qty }] från webbläsaren
// products: [{ id, name, price, active }] från databasen
export function computeOrder(items, products) {
  if (!Array.isArray(items) || items.length === 0) throw new Error('Kassen är tom')
  if (items.length > MAX_LINES) throw new Error('För många rader')

  const byId = new Map(products.map(p => [p.id, p]))
  const seen = new Set()

  const lines = items.map(item => {
    const product = byId.get(item?.id)
    if (!product || product.active === false) throw new Error(`Okänd produkt: ${item?.id}`)
    if (seen.has(product.id)) throw new Error(`Dubblett: ${product.id}`)
    seen.add(product.id)

    const qty = Number(item.qty)
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) throw new Error(`Ogiltigt antal för ${product.id}`)

    return { id: product.id, name: product.name, price: Number(product.price), qty }
  })

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0)
  const shipping = subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_COST
  return { lines, subtotal, shipping, total: subtotal + shipping }
}

// Stripe räknar i minsta valutaenhet: 249 kr = 24900 öre
export const toOre = kr => Math.round(kr * 100)
