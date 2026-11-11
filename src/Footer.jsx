import { useState } from 'react'
import { Link } from 'react-router-dom'
import { RITUALS } from './data/catalog'

const PROMISES = [
  { title: 'Free delivery', text: 'On all orders over 499 kr' },
  { title: '30-day returns', text: 'Changed your mind? No problem' },
  { title: 'Gift wrapping', text: 'Every order, wrapped with care' },
]

function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'error' | 'done'

  function handleSubmit(e) {
    e.preventDefault()
    // Demo: inget skickas. Senare kopplar du det här till t.ex. Mailchimp
    setStatus(/^\S+@\S+\.\S+$/.test(email) ? 'done' : 'error')
  }

  if (status === 'done') {
    return <p className="newsletter-done">Thank you. Welcome to the Senbon Zakura community.</p>
  }

  return (
    <form className="newsletter" onSubmit={handleSubmit} noValidate>
      <label htmlFor="newsletter-email" className="visually-hidden">Email address</label>
      <input
        id="newsletter-email"
        type="email"
        placeholder="Your email address"
        value={email}
        onChange={e => setEmail(e.target.value)}
        aria-invalid={status === 'error'}
      />
      <button type="submit" className="btn btn-dark">Subscribe</button>
      {status === 'error' && <p className="field-error">Please enter a valid email.</p>}
    </form>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <ul className="promises">
        {PROMISES.map(p => (
          <li key={p.title}>
            <strong>{p.title}</strong>
            <span>{p.text}</span>
          </li>
        ))}
      </ul>

      <div className="footer-main">
        <div className="footer-col footer-signup">
          <h2>Join our community</h2>
          <p className="muted">New rituals, seasonal launches and calm in your inbox once a month.</p>
          <Newsletter />
        </div>
        <div className="footer-col">
          <h3>Rituals</h3>
          <ul>
            {RITUALS.map(r => <li key={r.slug}><Link to={`/rituals/${r.slug}`}>{r.name}</Link></li>)}
          </ul>
        </div>
        <div className="footer-col">
          <h3>Customer care</h3>
          <ul>
            <li><Link to="/order">Checkout</Link></li>
            <li>Delivery 2–4 days</li>
            <li>30-day returns</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span className="brand-name">Senbon Zakura</span>
        <span>© {new Date().getFullYear()} · Demo shop</span>
      </div>
    </footer>
  )
}

export default Footer
