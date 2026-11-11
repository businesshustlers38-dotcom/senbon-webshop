/*
  stripe-webhook Stripe anropar den här när en betalning är klar

  Varför webhook: kunden kan stänga fliken innan den kommer tillbaka till
  din sida. Stripe skickar ändå alltid det här meddelandet.
  Signaturen bevisar att meddelandet kommer från Stripe och inte från en fuskare.

  Hemligheter: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
  Deploya med --no-verify-jwt (Stripe har ingen Supabase-inloggning)
*/
import Stripe from 'npm:stripe@17'
import { createClient } from 'npm:@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'))
const db = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'))
const cryptoProvider = Stripe.createSubtleCryptoProvider()

Deno.serve(async req => {
  const signature = req.headers.get('stripe-signature')
  const body = await req.text() // Måste vara RÅ text, annars stämmer inte signaturen

  let event
  try {
    event = await stripe.webhooks.constructEventAsync(
      body, signature, Deno.env.get('STRIPE_WEBHOOK_SECRET'), undefined, cryptoProvider,
    )
  } catch (err) {
    console.error('Ogiltig signatur', err.message)
    return new Response('Invalid signature', { status: 400 })
  }

  const session = event.data.object
  const number = session.metadata?.order_number

  if (event.type === 'checkout.session.completed' && number) {
    // Klarna m.fl. kan vara "unpaid" en stund efter att sessionen är klar
    const status = session.payment_status === 'paid' ? 'betald' : 'betalning behandlas'
    await db.from('orders').update({ status }).eq('number', number)
  }
  if (event.type === 'checkout.session.async_payment_succeeded' && number) {
    await db.from('orders').update({ status: 'betald' }).eq('number', number)
  }
  if (event.type === 'checkout.session.async_payment_failed' && number) {
    await db.from('orders').update({ status: 'betalning misslyckades' }).eq('number', number)
  }

  // Svara 200 snabbt, annars försöker Stripe skicka igen
  return new Response('ok', { status: 200 })
})
