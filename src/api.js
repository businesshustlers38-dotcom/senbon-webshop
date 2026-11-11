import { PRODUCTS, RITUALS } from './data/catalog'

/*
  api.js Den enda dörren till produktdatan

  Förut hämtade vi från DummyJSON, nu läser vi från vår egen catalog.js.
  Funktionerna är fortfarande async och returnerar Promises,
  så komponenterna behövde nästan inte ändras alls.
  Byter du senare till en riktig backend (t.ex. Supabase eller Shopify)
  ändrar du bara den här filen.
*/

// Låtsas-fördröjning så laddningslägen syns precis som med ett riktigt API
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

export async function fetchProducts() {
  await delay(150)
  return PRODUCTS
}

export async function fetchProduct(id) {
  await delay(100)
  const product = PRODUCTS.find(p => p.id === id)
  if (!product) throw new Error('Product not found')
  return product
}

export async function fetchRitual(slug) {
  await delay(100)
  const ritual = RITUALS.find(r => r.slug === slug)
  if (!ritual) throw new Error('Ritual not found')
  return { ritual, products: PRODUCTS.filter(p => p.ritual === slug) }
}
