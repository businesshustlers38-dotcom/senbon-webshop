import { useState } from 'react'
import { useReviews } from './useReviews'
import { isDemo } from './backend'

// Visar 5 stjärnor, fyllda upp till rating
export function Stars({ rating, size = '1rem' }) {
  return (
    <span className="stars" style={{ fontSize: size }} aria-label={`${rating.toFixed(1)} av 5 stjärnor`}>
      {[1, 2, 3, 4, 5].map(n => (
        <span key={n} aria-hidden="true" className={n <= Math.round(rating) ? 'star on' : 'star'}>★</span>
      ))}
    </span>
  )
}

const EMPTY = { name: '', rating: 0, text: '' }

function Reviews({ productId }) {
  const { status, reviews, average, addReview } = useReviews(productId)
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const [sending, setSending] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.rating) return setError('Välj ett betyg.')
    if (form.name.trim().length < 2) return setError('Skriv ditt namn.')
    if (form.text.trim().length < 10) return setError('Skriv minst 10 tecken.')

    setSending(true)
    try {
      await addReview({ name: form.name.trim(), rating: form.rating, text: form.text.trim() })
      setForm(EMPTY)
      setError('')
      setOpen(false)
    } catch {
      setError('Recensionen kunde inte sparas. Försök igen.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="reviews" aria-labelledby="reviews-title">
      <div className="reviews-head">
        <div>
          <h2 id="reviews-title" className="section-title">Recensioner</h2>
          {status === 'loading' && <p className="muted">Laddar recensioner…</p>}
          {status === 'error' && <p className="muted">Recensionerna kunde inte laddas just nu.</p>}
          {status === 'ready' && (reviews.length > 0 ? (
            <p className="reviews-summary">
              <Stars rating={average} /> {average.toFixed(1)} · {reviews.length} {reviews.length === 1 ? 'recension' : 'recensioner'}
            </p>
          ) : (
            <p className="muted">Inga recensioner än. Bli först att dela din ritual.</p>
          ))}
        </div>
        {!open && <button className="btn btn-outline" onClick={() => setOpen(true)}>Skriv en recension</button>}
      </div>

      {open && (
        <form className="review-form" onSubmit={handleSubmit} noValidate>
          {/* Radioknappar som ser ut som stjärnor, fungerar med tangentbordet */}
          <fieldset className="rating-input">
            <legend>Ditt betyg</legend>
            {[1, 2, 3, 4, 5].map(n => (
              <label key={n} className={n <= form.rating ? 'star on' : 'star'}>
                <input
                  type="radio"
                  name="rating"
                  value={n}
                  checked={form.rating === n}
                  onChange={() => setForm({ ...form, rating: n })}
                  className="visually-hidden"
                />
                <span aria-hidden="true">★</span>
                <span className="visually-hidden">{n} stjärnor</span>
              </label>
            ))}
          </fieldset>

          <div className="field">
            <label htmlFor="review-name">Namn</label>
            <input id="review-name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="review-text">Din recension</label>
            <textarea id="review-text" rows="4" value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} />
          </div>

          {error && <p className="field-error" role="alert">{error}</p>}

          <div className="review-actions">
            <button type="submit" className="btn btn-dark" disabled={sending}>
              {sending ? 'Skickar…' : 'Skicka recension'}
            </button>
            <button type="button" className="link-btn" onClick={() => { setOpen(false); setError('') }}>Avbryt</button>
          </div>
          {isDemo && <p className="muted small">Demo: recensioner sparas bara i den här webbläsaren.</p>}
        </form>
      )}

      <ul className="review-list">
        {reviews.map(r => (
          <li key={r.date} className="review">
            <Stars rating={r.rating} size="0.9rem" />
            <p className="review-text">{r.text}</p>
            <p className="muted small">{r.name} · {new Date(r.date).toLocaleDateString('sv-SE')}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

/*
  Reviews.jsx Recensioner på produktsidan

  Vad den gör:
  Hämtar och sparar via useReviews → backend.js (Supabase eller localStorage)
  Visar laddning, fel och tomt läge, inte bara det lyckade fallet
  Inga påhittade recensioner: sidan börjar tom tills riktiga kunder skriver
*/

export default Reviews
