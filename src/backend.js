import { createClient } from '@supabase/supabase-js'

/*
  backend.js Allt som ska SPARAS (recensioner, nyhetsbrev, ordrar)

  Två lägen:
  1. Supabase är inkopplat (VITE_SUPABASE_URL och VITE_SUPABASE_ANON_KEY finns i .env)
     → allt sparas i en riktig databas och syns för alla besökare
  2. Inte inkopplat (demo-läge)
     → allt sparas i webbläsarens localStorage och syns bara för dig

  Komponenterna vet inte vilket läge som används. Det är hela poängen:
  de anropar bara funktionerna här nedanför.
*/

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = url && anonKey ? createClient(url, anonKey) : null
export const isDemo = !supabase

// ===== Hjälpfunktioner för demo-läget =====
function readLocal(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key))
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

function writeLocal(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Privat läge eller fullt lagringsutrymme: ignorera
  }
}

// ===== Recensioner =====
export async function getReviews(productId) {
  if (isDemo) return readLocal(`senbon-reviews-${productId}`)

  const { data, error } = await supabase
    .from('reviews')
    .select('name, rating, body, created_at')
    .eq('product_id', productId)
    .order('created_at', { ascending: false })
  if (error) throw error

  // Databasen använder snake_case, appen använder egna namn
  return data.map(r => ({ name: r.name, rating: r.rating, text: r.body, date: r.created_at }))
}

export async function addReview(productId, review) {
  const saved = { ...review, date: new Date().toISOString() }

  if (isDemo) {
    const key = `senbon-reviews-${productId}`
    writeLocal(key, [saved, ...readLocal(key)])
    return saved
  }

  const { error } = await supabase
    .from('reviews')
    .insert({ product_id: productId, name: review.name, rating: review.rating, body: review.text })
  if (error) throw error
  return saved
}

// ===== Nyhetsbrev =====
export async function subscribe(email) {
  const clean = email.trim().toLowerCase()

  if (isDemo) {
    const list = readLocal('senbon-newsletter')
    if (!list.includes(clean)) writeLocal('senbon-newsletter', [...list, clean])
    return
  }

  const { error } = await supabase.from('newsletter').insert({ email: clean })
  // 23505 = adressen finns redan. Det är inget fel för kunden.
  if (error && error.code !== '23505') throw error
}

// ===== Ordrar och betalning =====
// Returnerar antingen:
//   { type: 'redirect', url }  → Supabase + Stripe: skicka kunden till Stripes betalsida
//   { type: 'done', order }    → demo-läge: ordern sparas lokalt, ingen betalning
export async function placeOrder({ customer, cart }) {
  // Webbläsaren skickar BARA id och antal. Priset räknas ut på servern.
  const items = cart.map(i => ({ id: i.id, qty: i.qty }))

  if (isDemo) {
    const number = `SZ-${Date.now().toString(36).toUpperCase()}`
    const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0)
    const order = { number, customer, items, date: new Date().toISOString() }
    writeLocal('senbon-orders', [...readLocal('senbon-orders'), order])
    return { type: 'done', order: { ...order, total } }
  }

  const { data, error } = await supabase.functions.invoke('create-checkout', {
    body: { items, customer },
  })
  if (error || !data?.url) throw error ?? new Error('Ingen betalningslänk')
  return { type: 'redirect', url: data.url }
}
