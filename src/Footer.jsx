import { useState } from 'react'
import { Link } from 'react-router-dom'
import { RITUALS } from './data/catalog'
import { subscribe, isDemo } from './backend'
import { formatPrice, FREE_SHIPPING_FROM } from './format'

const PROMISES = [
  { title: 'Fri frakt', text: `På alla ordrar över ${formatPrice(FREE_SHIPPING_FROM)}` },
  { title: '30 dagars retur', text: 'Ångrat dig? Inga problem' },
  { title: 'Presentinslagning', text: 'Varje order, inslagen med omsorg' },
]

function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'sending' | 'invalid' | 'failed' | 'done'

  async function handleSubmit(e) {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) return setStatus('invalid')
    setStatus('sending')
    try {
      await subscribe(email)
      setStatus('done')
    } catch {
      setStatus('failed')
    }
  }

  if (status === 'done') {
    return <p className="newsletter-done">Tack! Välkommen till Senbon Zakura.</p>
  }

  return (
    <form className="newsletter" onSubmit={handleSubmit} noValidate>
      <label htmlFor="newsletter-email" className="visually-hidden">E-postadress</label>
      <input
        id="newsletter-email"
        type="email"
        placeholder="Din e-postadress"
        value={email}
        onChange={e => setEmail(e.target.value)}
        aria-invalid={status === 'invalid'}
      />
      <button type="submit" className="btn btn-dark" disabled={status === 'sending'}>
        {status === 'sending' ? 'Skickar…' : 'Prenumerera'}
      </button>
      {status === 'invalid' && <p className="field-error">Skriv en giltig e-postadress.</p>}
      {status === 'failed' && <p className="field-error">Något gick fel. Försök igen.</p>}
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
          <h2>Bli en del av vår värld</h2>
          <p className="muted">Nya ritualer, säsongens lanseringar och lite lugn i inkorgen en gång i månaden.</p>
          <Newsletter />
        </div>
        <div className="footer-col">
          <h3>Ritualer</h3>
          <ul>
            {RITUALS.map(r => <li key={r.slug}><Link to={`/ritualer/${r.slug}`}>{r.name}</Link></li>)}
            <li><Link to="/hitta-din-ritual">Hitta din ritual</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h3>Kundservice</h3>
          <ul>
            <li><Link to="/om-oss">Om oss</Link></li>
            <li><Link to="/kassa">Kassa</Link></li>
            <li>Leverans 2–4 dagar</li>
            <li>30 dagars retur</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span className="brand-name">Senbon Zakura</span>
        <span>© {new Date().getFullYear()} · {isDemo ? 'Demobutik (lokalt läge)' : 'Demobutik'}</span>
      </div>
    </footer>
  )
}

export default Footer
