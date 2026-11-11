import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCart } from './cartContext'

/*
  OrderKlar.jsx Stripe skickar tillbaka kunden hit efter betalning

  Den här sidan BEVISAR inte att betalningen gick igenom (vem som helst kan skriva in URL:en).
  Det riktiga beviset är webhooken som sätter ordern till 'betald' i databasen.
  Därför gör sidan bara ofarliga saker: tömmer kassen och säger tack.
*/
function OrderKlar() {
  const [params] = useSearchParams()
  const number = params.get('order')
  const { clearCart } = useCart()

  // Tömmer kassen en gång när sidan visas
  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <section className="confirm">
      {number && <p className="eyebrow">Order {number}</p>}
      <h1 className="section-title">Tack för din beställning</h1>
      <p>Vi har tagit emot din betalning och skickar ett kvitto till din e-post från Stripe.</p>
      <p className="muted">Paketet skickas inom 1–2 arbetsdagar.</p>
      <Link to="/" className="btn btn-dark">Fortsätt handla</Link>
    </section>
  )
}

export default OrderKlar
