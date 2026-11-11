import { useState } from 'react'
import { useReviews } from './useReviews'

// Visar 5 stjärnor, fyllda upp till rating
export function Stars({ rating, size = '1rem' }) {
  return (
    <span className="stars" style={{ fontSize: size }} aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map(n => (
        <span key={n} aria-hidden="true" className={n <= Math.round(rating) ? 'star on' : 'star'}>★</span>
      ))}
    </span>
  )
}

const EMPTY = { name: '', rating: 0, text: '' }

function Reviews({ productId }) {
  const { reviews, average, addReview } = useReviews(productId)
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.rating) return setError('Please choose a rating.')
    if (form.name.trim().length < 2) return setError('Please enter your name.')
    if (form.text.trim().length < 10) return setError('Please write at least 10 characters.')

    addReview({ name: form.name.trim(), rating: form.rating, text: form.text.trim() })
    setForm(EMPTY)
    setError('')
    setOpen(false)
  }

  return (
    <section className="reviews" aria-labelledby="reviews-title">
      <div className="reviews-head">
        <div>
          <h2 id="reviews-title" className="section-title">Reviews</h2>
          {reviews.length > 0 ? (
            <p className="reviews-summary">
              <Stars rating={average} /> {average.toFixed(1)} · {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </p>
          ) : (
            <p className="muted">No reviews yet. Be the first to share your ritual.</p>
          )}
        </div>
        {!open && <button className="btn btn-outline" onClick={() => setOpen(true)}>Write a review</button>}
      </div>

      {open && (
        <form className="review-form" onSubmit={handleSubmit} noValidate>
          {/* Radioknappar som ser ut som stjärnor, fungerar med tangentbordet */}
          <fieldset className="rating-input">
            <legend>Your rating</legend>
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
                <span className="visually-hidden">{n} stars</span>
              </label>
            ))}
          </fieldset>

          <div className="field">
            <label htmlFor="review-name">Name</label>
            <input id="review-name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="review-text">Your review</label>
            <textarea id="review-text" rows="4" value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} />
          </div>

          {error && <p className="field-error" role="alert">{error}</p>}

          <div className="review-actions">
            <button type="submit" className="btn btn-dark">Submit review</button>
            <button type="button" className="link-btn" onClick={() => { setOpen(false); setError('') }}>Cancel</button>
          </div>
          <p className="muted small">Demo: reviews are saved in this browser only.</p>
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
  Visar snittbetyg och alla recensioner för en produkt
  Formulär med stjärnor (radioknappar), namn och text med validering
  Inga påhittade recensioner: sidan börjar tom tills riktiga kunder skriver
*/

export default Reviews
