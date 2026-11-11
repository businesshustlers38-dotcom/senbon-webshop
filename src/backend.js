import { createClient } from '@supabase/supabase-js'
import { FREE_SHIPPING_FROM, SHIPPING_COST } from '../supabase/functions/_shared/pricing.js'

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
    .select('id, name, rating, body, created_at')
    .eq('product_id', productId)
    .order('created_at', { ascending: false })
  if (error) throw error

  // Databasen använder snake_case, appen använder egna namn
  return data.map(r => ({ id: r.id, name: r.name, rating: r.rating, text: r.body, date: r.created_at }))
}

export async function addReview(productId, review) {
  const saved = { ...review, id: crypto.randomUUID(), date: new Date().toISOString() }

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
    const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0)
    const shipping = subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_COST
    const order = {
      number,
      customer,
      items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
      subtotal,
      shipping,
      total: subtotal + shipping,
      status: 'betald', // Demo: låtsas att betalningen gick igenom
      date: new Date().toISOString(),
    }
    writeLocal('senbon-orders', [...readLocal('senbon-orders'), order])
    return { type: 'done', order }
  }

  const { data, error } = await supabase.functions.invoke('create-checkout', {
    body: { items, customer },
  })
  if (error || !data?.url) throw error ?? new Error('Ingen betalningslänk')
  return { type: 'redirect', url: data.url }
}

// =========================================================
// ADMIN
// Alla funktioner nedan fungerar bara om databasen säger att du är admin (RLS).
// Även om någon ändrar React-koden får de bara tomma svar eller fel.
// =========================================================

export const ORDER_STATUSES = [
  'väntar på betalning', 'betalning behandlas', 'betald', 'skickad', 'levererad', 'avbruten', 'betalning misslyckades',
]

// Returnerar { email } om inloggad admin, annars null
export async function getAdmin() {
  if (isDemo) return { email: 'demo' }
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null
  const { data } = await supabase.from('admins').select('user_id').eq('user_id', session.user.id).maybeSingle()
  return data ? { email: session.user.email } : null
}

export async function adminSignIn(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  const admin = await getAdmin()
  if (!admin) {
    await supabase.auth.signOut()
    throw new Error('Kontot är inte admin')
  }
  return admin
}

export async function adminSignOut() {
  if (!isDemo) await supabase.auth.signOut()
}

export async function getOrders() {
  if (isDemo) return readLocal('senbon-orders').slice().reverse()

  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data.map(o => ({
    number: o.number,
    customer: { name: o.name, email: o.email, address: o.address },
    items: o.items,
    subtotal: Number(o.subtotal),
    shipping: Number(o.shipping),
    total: Number(o.total),
    status: o.status,
    date: o.created_at,
  }))
}

export async function updateOrderStatus(number, status) {
  if (!ORDER_STATUSES.includes(status)) throw new Error('Ogiltig status')
  if (isDemo) {
    writeLocal('senbon-orders', readLocal('senbon-orders').map(o => (o.number === number ? { ...o, status } : o)))
    return
  }
  const { error } = await supabase.from('orders').update({ status }).eq('number', number)
  if (error) throw error
}

export async function getSubscribers() {
  if (isDemo) return readLocal('senbon-newsletter').map(email => ({ email, date: null }))
  const { data, error } = await supabase.from('newsletter').select('email, created_at').order('created_at', { ascending: false })
  if (error) throw error
  return data.map(r => ({ email: r.email, date: r.created_at }))
}

export async function getAllReviews() {
  if (isDemo) {
    // I demo-läget ligger recensionerna under en nyckel per produkt
    const all = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('senbon-reviews-')) {
        const productId = key.slice('senbon-reviews-'.length)
        readLocal(key).forEach(r => all.push({ ...r, productId }))
      }
    }
    return all.sort((a, b) => b.date.localeCompare(a.date))
  }
  const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data.map(r => ({ id: r.id, productId: r.product_id, name: r.name, rating: r.rating, text: r.body, date: r.created_at }))
}

export async function deleteReview(review) {
  if (isDemo) {
    const key = `senbon-reviews-${review.productId}`
    // Äldre demo-recensioner saknar id, då jämför vi datum
    writeLocal(key, readLocal(key).filter(r => (r.id ?? r.date) !== (review.id ?? review.date)))
    return
  }
  const { error } = await supabase.from('reviews').delete().eq('id', review.id)
  if (error) throw error
}
