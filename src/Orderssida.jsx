import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from './cartContext'
import { formatPrice, FREE_SHIPPING_FROM, SHIPPING_COST } from './format'
import { createOrder, isDemo } from './backend'

// Enkel validering, returnerar ett objekt med felmeddelanden per fält
function validate(form) {
  const errors = {}
  if (form.name.trim().length < 2) errors.name = 'Skriv ditt för- och efternamn.'
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Skriv en giltig e-postadress.'
  if (form.address.trim().length < 5) errors.address = 'Skriv din adress.'
  return errors
}

const FIELDS = [
  { name: 'name', label: 'För- och efternamn', autoComplete: 'name' },
  { name: 'email', label: 'E-post', type: 'email', autoComplete: 'email' },
  { name: 'address', label: 'Leveransadress', autoComplete: 'street-address' },
]

function Ordersida() {
  const { cart, subtotal, clearCart } = useCart()
  const [form, setForm] = useState({ name: '', email: '', address: '' })
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')

  // Sparar den lagda ordern så bekräftelsen kan visas efter att kassen tömts
  const [placedOrder, setPlacedOrder] = useState(null)

  const shipping = subtotal >= FREE_SHIPPING_FROM || subtotal === 0 ? 0 : SHIPPING_COST
  const total = subtotal + shipping

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setSending(true)
    setSendError('')
    try {
      const order = await createOrder({
        customer: { name: form.name.trim(), email: form.email.trim(), address: form.address.trim() },
        // Sparar bara det som behövs om varje rad, inte hela produkten
        items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
        subtotal,
        shipping,
        total,
      })
      setPlacedOrder(order)
      clearCart()
    } catch {
      setSendError('Ordern kunde inte skickas. Kontrollera din anslutning och försök igen.')
    } finally {
      setSending(false)
    }
  }

  if (placedOrder) {
    return (
      <section className="confirm">
        <p className="eyebrow">Order {placedOrder.number}</p>
        <h1 className="section-title">Tack, {placedOrder.customer.name}</h1>
        <p>Din order på {formatPrice(placedOrder.total)} är mottagen. En bekräftelse skickas till {placedOrder.customer.email}.</p>
        <p className="muted">(Demobutik: ingen betalning har dragits.)</p>
        <Link to="/" className="btn btn-dark">Fortsätt handla</Link>
      </section>
    )
  }

  if (cart.length === 0) {
    return (
      <section className="confirm">
        <h1 className="section-title">Din kasse är tom</h1>
        <Link to="/" className="btn btn-dark">Upptäck butiken</Link>
      </section>
    )
  }

  return (
    <section className="checkout">
      <form className="checkout-form" onSubmit={handleSubmit} noValidate>
        <h1 className="section-title">Kassa</h1>

        {FIELDS.map(field => (
          <div className="field" key={field.name}>
            <label htmlFor={field.name}>{field.label}</label>
            <input
              id={field.name}
              name={field.name}
              type={field.type ?? 'text'}
              autoComplete={field.autoComplete}
              value={form[field.name]}
              onChange={handleChange}
              aria-invalid={Boolean(errors[field.name])}
              aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
            />
            {errors[field.name] && (
              <p className="field-error" id={`${field.name}-error`}>{errors[field.name]}</p>
            )}
          </div>
        ))}

        {sendError && <p className="field-error" role="alert">{sendError}</p>}

        <button type="submit" className="btn btn-dark btn-block" disabled={sending}>
          {sending ? 'Skickar…' : 'Lägg order'}
        </button>
        <p className="muted small">
          Betalning läggs till senare. Inget kort debiteras.
          {isDemo && ' Demo: ordern sparas bara i den här webbläsaren.'}
        </p>
      </form>

      <aside className="summary">
        <h2>Ordersammanfattning</h2>
        <ul className="summary-items">
          {cart.map(item => (
            <li key={item.id}>
              <span>{item.qty} × {item.name}</span>
              <span>{formatPrice(item.price * item.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="row"><span>Delsumma</span><span>{formatPrice(subtotal)}</span></div>
        <div className="row"><span>Frakt</span><span>{shipping === 0 ? 'Fri' : formatPrice(shipping)}</span></div>
        <div className="row row-total"><span>Totalt</span><span>{formatPrice(total)}</span></div>
      </aside>
    </section>
  )
}

/*
  Ordersida.jsx Kassan

  Vad den gör:
  Validerar fälten och visar felmeddelanden under varje fält
  Skickar ordern via backend.js (Supabase eller localStorage)
  Knappen visar "Skickar…" och är avstängd så ingen klickar två gånger
  Tömmer kassen och visar ordernummer när ordern är sparad
*/

export default Ordersida
