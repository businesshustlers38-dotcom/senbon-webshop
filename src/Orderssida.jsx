import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from './cartContext'
import { formatPrice } from './format'

const SHIPPING_FREE_FROM = 50
const SHIPPING_COST = 4.95

// Enkel validering, returnerar ett objekt med felmeddelanden per fält
function validate(form) {
  const errors = {}
  if (form.name.trim().length < 2) errors.name = 'Please enter your full name.'
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Please enter a valid email.'
  if (form.address.trim().length < 5) errors.address = 'Please enter your address.'
  return errors
}

function Ordersida() {
  const { cart, subtotal, clearCart } = useCart()
  const [form, setForm] = useState({ name: '', email: '', address: '' })
  const [errors, setErrors] = useState({})

  // Sparar den lagda ordern så bekräftelsen kan visas efter att kundvagnen tömts
  const [placedOrder, setPlacedOrder] = useState(null)

  const shipping = subtotal >= SHIPPING_FREE_FROM || subtotal === 0 ? 0 : SHIPPING_COST
  const total = subtotal + shipping

  // En funktion för alla fält, name-attributet bestämmer vilket fält som ändras
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    // Stoppar webbläsarens vanliga omladdning vid submit
    e.preventDefault()
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setPlacedOrder({
      number: `SZ-${Date.now().toString().slice(-6)}`,
      name: form.name.trim(),
      email: form.email,
      total,
    })
    clearCart()
  }

  if (placedOrder) {
    return (
      <section className="confirm">
        <p className="eyebrow">Order {placedOrder.number}</p>
        <h1 className="section-title">Thank you, {placedOrder.name}</h1>
        <p>Your order of {formatPrice(placedOrder.total)} is confirmed. A receipt will be sent to {placedOrder.email}.</p>
        <p className="muted">(Demo shop: no payment has been taken.)</p>
        <Link to="/" className="btn btn-dark">Continue shopping</Link>
      </section>
    )
  }

  if (cart.length === 0) {
    return (
      <section className="confirm">
        <h1 className="section-title">Your bag is empty</h1>
        <Link to="/" className="btn btn-dark">Discover the shop</Link>
      </section>
    )
  }

  return (
    <section className="checkout">
      {/* noValidate: vi visar egna felmeddelanden istället för webbläsarens */}
      <form className="checkout-form" onSubmit={handleSubmit} noValidate>
        <h1 className="section-title">Checkout</h1>

        {[
          { name: 'name', label: 'Full name', autoComplete: 'name' },
          { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
          { name: 'address', label: 'Delivery address', autoComplete: 'street-address' },
        ].map(field => (
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

        <button type="submit" className="btn btn-dark btn-block">Place order</button>
        <p className="muted small">Payment will be added later. No card is charged.</p>
      </form>

      <aside className="summary">
        <h2>Order summary</h2>
        <ul className="summary-items">
          {cart.map(item => (
            <li key={item.id}>
              <span>{item.qty} × {item.title}</span>
              <span>{formatPrice(item.price * item.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
        <div className="row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
        <div className="row row-total"><span>Total</span><span>{formatPrice(total)}</span></div>
      </aside>
    </section>
  )
}

/*
  Ordersida.jsx Kassan

  Vad den gör:
  Ett form-objekt i state istället för ett state per fält
  validate() visar tydliga felmeddelanden under varje fält
  Gratis frakt över $50, annars $4.95
  Fix: kundvagnen töms efter lagd order och bekräftelsen visar ordernummer
*/

export default Ordersida
