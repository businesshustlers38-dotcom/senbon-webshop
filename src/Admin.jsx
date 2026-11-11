import { useCallback, useEffect, useState } from 'react'
import {
  isDemo, getAdmin, adminSignIn, adminSignOut,
  getOrders, updateOrderStatus, getSubscribers, getAllReviews, deleteReview, ORDER_STATUSES,
} from './backend'
import { getProduct } from './data/catalog'
import { formatPrice } from './format'
import { Stars } from './Reviews'

/*
  Admin.jsx Butikens adminsida på /admin

  Laddas med React.lazy i App.jsx, så vanliga kunder aldrig laddar ner den här koden.
  OBS: inloggningen här är bara en DÖRR. Det riktiga LÅSET är RLS-reglerna i schema.sql.
*/

// Statusar som räknas som försäljning
const SOLD = ['betald', 'skickad', 'levererad']
const formatDate = d => (d ? new Date(d).toLocaleString('sv-SE', { dateStyle: 'short', timeStyle: 'short' }) : '–')

// ===== Inloggning =====
function Login({ onSignedIn }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSending(true)
    setError('')
    try {
      onSignedIn(await adminSignIn(form.email, form.password))
    } catch (err) {
      setError(err.message === 'Kontot är inte admin' ? err.message : 'Fel e-post eller lösenord.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="admin-login">
      <h1 className="section-title">Admin</h1>
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="admin-email">E-post</label>
          <input id="admin-email" type="email" autoComplete="username" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="admin-password">Lösenord</label>
          <input id="admin-password" type="password" autoComplete="current-password" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })} />
        </div>
        {error && <p className="field-error" role="alert">{error}</p>}
        <button className="btn btn-dark btn-block" disabled={sending}>{sending ? 'Loggar in…' : 'Logga in'}</button>
      </form>
    </section>
  )
}

// ===== Översikt =====
function Overview({ orders }) {
  const sold = orders.filter(o => SOLD.includes(o.status))
  const revenue = sold.reduce((sum, o) => sum + o.total, 0)
  const toShip = orders.filter(o => o.status === 'betald').length

  // Mest sålda produkter: räknar antal per produkt-id
  const counts = {}
  sold.forEach(o => o.items.forEach(i => { counts[i.id] = (counts[i.id] ?? 0) + i.qty }))
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5)

  const stats = [
    { label: 'Försäljning', value: formatPrice(revenue) },
    { label: 'Sålda ordrar', value: sold.length },
    { label: 'Snittorder', value: sold.length ? formatPrice(Math.round(revenue / sold.length)) : '–' },
    { label: 'Att skicka', value: toShip, highlight: toShip > 0 },
  ]

  return (
    <>
      <ul className="stats">
        {stats.map(s => (
          <li key={s.label} className={s.highlight ? 'is-highlight' : ''}>
            <span className="eyebrow">{s.label}</span>
            <strong>{s.value}</strong>
          </li>
        ))}
      </ul>
      <h2 className="admin-h2">Mest sålda</h2>
      {top.length === 0 ? <p className="muted">Inga sålda produkter än.</p> : (
        <ol className="top-list">
          {top.map(([id, qty]) => <li key={id}><span>{getProduct(id)?.name ?? id}</span><span>{qty} st</span></li>)}
        </ol>
      )}
    </>
  )
}

// ===== Ordrar =====
function Orders({ orders, onStatusChange }) {
  const [filter, setFilter] = useState('alla')
  const [open, setOpen] = useState(null)

  const visible = filter === 'alla' ? orders : orders.filter(o => o.status === filter)

  return (
    <>
      <div className="chips" role="group" aria-label="Filtrera på status">
        {['alla', ...ORDER_STATUSES].map(s => {
          const n = s === 'alla' ? orders.length : orders.filter(o => o.status === s).length
          if (s !== 'alla' && n === 0) return null
          return (
            <button key={s} className="chip" aria-pressed={filter === s} onClick={() => setFilter(s)}>
              {s} ({n})
            </button>
          )
        })}
      </div>

      {visible.length === 0 ? <p className="muted">Inga ordrar.</p> : (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Order</th><th>Datum</th><th>Kund</th><th>Totalt</th><th>Status</th></tr>
            </thead>
            <tbody>
              {visible.map(o => (
                <OrderRow key={o.number} order={o} expanded={open === o.number}
                  onToggle={() => setOpen(open === o.number ? null : o.number)}
                  onStatusChange={onStatusChange} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

function OrderRow({ order, expanded, onToggle, onStatusChange }) {
  return (
    <>
      <tr>
        <td>
          <button className="link-btn" onClick={onToggle} aria-expanded={expanded}>{order.number}</button>
        </td>
        <td>{formatDate(order.date)}</td>
        <td>{order.customer?.name}</td>
        <td>{formatPrice(order.total)}</td>
        <td>
          <select
            className={`status-select status-${order.status.replace(/\s/g, '-')}`}
            value={order.status}
            onChange={e => onStatusChange(order.number, e.target.value)}
            aria-label={`Status för ${order.number}`}
          >
            {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </td>
      </tr>
      {expanded && (
        <tr className="order-details">
          <td colSpan="5">
            <div className="order-details-grid">
              <div>
                <p className="eyebrow">Kund</p>
                <p>{order.customer?.name}<br />{order.customer?.email}<br />{order.customer?.address}</p>
              </div>
              <div>
                <p className="eyebrow">Produkter</p>
                <ul>
                  {order.items.map(i => (
                    <li key={i.id}>{i.qty} × {i.name ?? getProduct(i.id)?.name ?? i.id} · {formatPrice(i.price * i.qty)}</li>
                  ))}
                </ul>
                <p className="muted small">Frakt {formatPrice(order.shipping)} · Totalt {formatPrice(order.total)}</p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

// ===== Recensioner =====
function ReviewsAdmin() {
  const [state, setState] = useState({ status: 'loading', reviews: [] })

  useEffect(() => {
    let ignore = false
    getAllReviews()
      .then(reviews => !ignore && setState({ status: 'ready', reviews }))
      .catch(() => !ignore && setState({ status: 'error', reviews: [] }))
    return () => { ignore = true }
  }, [])

  async function handleDelete(review) {
    if (!window.confirm(`Ta bort recensionen från ${review.name}?`)) return
    await deleteReview(review)
    setState(s => ({ ...s, reviews: s.reviews.filter(r => r !== review) }))
  }

  if (state.status === 'loading') return <p className="muted">Laddar…</p>
  if (state.status === 'error') return <p className="field-error">Kunde inte hämta recensioner.</p>
  if (state.reviews.length === 0) return <p className="muted">Inga recensioner än.</p>

  return (
    <ul className="admin-reviews">
      {state.reviews.map(r => (
        <li key={r.id ?? r.date}>
          <div>
            <p className="eyebrow">{getProduct(r.productId)?.name ?? r.productId}</p>
            <Stars rating={r.rating} size="0.85rem" />
            <p className="review-text">{r.text}</p>
            <p className="muted small">{r.name} · {formatDate(r.date)}</p>
          </div>
          <button className="link-btn" onClick={() => handleDelete(r)}>Ta bort</button>
        </li>
      ))}
    </ul>
  )
}

// ===== Nyhetsbrev =====
function Subscribers() {
  const [list, setList] = useState(null)

  useEffect(() => {
    let ignore = false
    getSubscribers().then(data => !ignore && setList(data)).catch(() => !ignore && setList([]))
    return () => { ignore = true }
  }, [])

  // Skapar en CSV-fil i webbläsaren och laddar ner den, ingen server behövs
  function exportCsv() {
    const rows = ['email,datum', ...list.map(s => `${s.email},${s.date ?? ''}`)]
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = Object.assign(document.createElement('a'), { href: url, download: 'nyhetsbrev.csv' })
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!list) return <p className="muted">Laddar…</p>
  return (
    <>
      <div className="admin-row">
        <p>{list.length} prenumeranter</p>
        {list.length > 0 && <button className="btn btn-outline" onClick={exportCsv}>Exportera CSV</button>}
      </div>
      <ul className="sub-list">
        {list.map(s => <li key={s.email}><span>{s.email}</span><span className="muted">{formatDate(s.date)}</span></li>)}
      </ul>
    </>
  )
}

// ===== Huvudkomponent =====
const TABS = ['Översikt', 'Ordrar', 'Recensioner', 'Nyhetsbrev']

function Admin() {
  const [admin, setAdmin] = useState(undefined) // undefined = kollar, null = utloggad
  const [tab, setTab] = useState(TABS[0])
  const [orders, setOrders] = useState({ status: 'loading', list: [] })

  // Sökmotorer ska inte visa adminsidan
  useEffect(() => {
    const meta = Object.assign(document.createElement('meta'), { name: 'robots', content: 'noindex' })
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [])

  useEffect(() => {
    getAdmin().then(setAdmin).catch(() => setAdmin(null))
  }, [])

  const loadOrders = useCallback(() => {
    return getOrders()
      .then(list => setOrders({ status: 'ready', list }))
      .catch(() => setOrders({ status: 'error', list: [] }))
  }, [])

  useEffect(() => {
    if (admin) loadOrders()
  }, [admin, loadOrders])

  async function handleStatusChange(number, status) {
    // Optimistisk uppdatering: visa ändringen direkt, ångra om servern säger nej
    const previous = orders.list
    setOrders(o => ({ ...o, list: o.list.map(x => (x.number === number ? { ...x, status } : x)) }))
    try {
      await updateOrderStatus(number, status)
    } catch {
      setOrders(o => ({ ...o, list: previous }))
      window.alert('Statusen kunde inte sparas.')
    }
  }

  async function handleSignOut() {
    await adminSignOut()
    setAdmin(null)
  }

  if (admin === undefined) return <p className="status">Laddar…</p>
  if (!admin) return <Login onSignedIn={setAdmin} />

  return (
    <section className="admin wrap">
      <div className="admin-head">
        <div>
          <p className="eyebrow">{isDemo ? 'Demo-läge · data från den här webbläsaren' : `Inloggad som ${admin.email}`}</p>
          <h1 className="section-title">Admin</h1>
        </div>
        <div className="admin-actions">
          <button className="btn btn-outline" onClick={loadOrders}>Uppdatera</button>
          {!isDemo && <button className="link-btn" onClick={handleSignOut}>Logga ut</button>}
        </div>
      </div>

      <div className="admin-tabs" role="tablist">
        {TABS.map(t => (
          <button key={t} role="tab" aria-selected={tab === t} className="admin-tab" onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      <div role="tabpanel">
        {orders.status === 'error' && <p className="field-error">Kunde inte hämta ordrar.</p>}
        {tab === 'Översikt' && <Overview orders={orders.list} />}
        {tab === 'Ordrar' && <Orders orders={orders.list} onStatusChange={handleStatusChange} />}
        {tab === 'Recensioner' && <ReviewsAdmin />}
        {tab === 'Nyhetsbrev' && <Subscribers />}
      </div>
    </section>
  )
}

export default Admin
