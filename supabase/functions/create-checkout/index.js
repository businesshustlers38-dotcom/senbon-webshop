/*
  create-checkout Supabase Edge Function (körs på servern, inte i webbläsaren)

  1. Tar emot { items: [{ id, qty }], customer: { name, email, address } }
  2. Hämtar RIKTIGA priser från tabellen products
  3. Sparar ordern med status 'väntar på betalning'
  4. Skapar en Stripe Checkout-session och returnerar dess URL

  Hemligheter (sätts med `supabase secrets set`, finns aldrig i koden):
  STRIPE_SECRET_KEY, SITE_URL
  SUPABASE_URL och SUPABASE_SERVICE_ROLE_KEY finns automatiskt
*/
import Stripe from 'npm:stripe@17'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { computeOrder, toOre } from '../_shared/pricing.js'
import { corsHeaders, json } from '../_shared/cors.js'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'))
// service_role-nyckeln får gå förbi RLS. Den finns BARA här på servern.
const db = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'))
const SITE_URL = Deno.env.get('SITE_URL') ?? 'http://localhost:5173'

function validCustomer(c) {
  return c
    && typeof c.name === 'string' && c.name.trim().length >= 2 && c.name.length <= 100
    && typeof c.email === 'string' && /^\S+@\S+\.\S+$/.test(c.email) && c.email.length <= 200
    && typeof c.address === 'string' && c.address.trim().length >= 5 && c.address.length <= 300
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  try {
    const { items, customer } = await req.json()
    if (!validCustomer(customer)) return json({ error: 'Ogiltiga kunduppgifter' }, 400)

    // ① Riktiga priser från databasen
    const ids = Array.isArray(items) ? items.map(i => i?.id) : []
    const { data: products, error: dbError } = await db
      .from('products').select('id, name, price, active').in('id', ids)
    if (dbError) throw dbError

    // ② Räkna ut ordern (kastar fel vid fusk eller trasig data)
    let order
    try {
      order = computeOrder(items, products)
    } catch (err) {
      return json({ error: err.message }, 400)
    }

    // ③ Spara ordern innan betalning, så inget försvinner
    const number = `SZ-${Date.now().toString(36).toUpperCase()}`
    const { error: insertError } = await db.from('orders').insert({
      number,
      name: customer.name.trim(),
      email: customer.email.trim(),
      address: customer.address.trim(),
      items: order.lines,
      subtotal: order.subtotal,
      shipping: order.shipping,
      total: order.total,
      status: 'väntar på betalning',
    })
    if (insertError) throw insertError

    // ④ Stripe Checkout. Betalsätt (kort, Klarna, Apple Pay…) styrs i Stripe Dashboard.
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      locale: 'sv',
      customer_email: customer.email.trim(),
      client_reference_id: number,
      metadata: { order_number: number },
      line_items: order.lines.map(l => ({
        quantity: l.qty,
        price_data: { currency: 'sek', unit_amount: toOre(l.price), product_data: { name: l.name } },
      })),
      shipping_options: [{
        shipping_rate_data: {
          type: 'fixed_amount',
          display_name: order.shipping === 0 ? 'Fri frakt' : 'Standardfrakt',
          fixed_amount: { amount: toOre(order.shipping), currency: 'sek' },
        },
      }],
      success_url: `${SITE_URL}/kassa/klar?order=${number}`,
      cancel_url: `${SITE_URL}/kassa`,
    })

    await db.from('orders').update({ stripe_session_id: session.id }).eq('number', number)

    return json({ url: session.url, number })
  } catch (err) {
    console.error(err)
    return json({ error: 'Något gick fel på servern' }, 500)
  }
})
