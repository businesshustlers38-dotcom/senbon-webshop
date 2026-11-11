import { useEffect, useState } from 'react'
import { getReviews, addReview as saveReview } from './backend'

/*
  useReviews.js Egen hook för recensioner

  Hämtar och sparar via backend.js, som väljer Supabase eller localStorage.
  status: 'loading' | 'ready' | 'error'
*/
export function useReviews(productId) {
  const [state, setState] = useState({ status: 'loading', reviews: [] })

  useEffect(() => {
    let ignore = false
    getReviews(productId)
      .then(reviews => !ignore && setState({ status: 'ready', reviews }))
      .catch(() => !ignore && setState({ status: 'error', reviews: [] }))
    return () => { ignore = true }
  }, [productId])

  async function addReview(review) {
    const saved = await saveReview(productId, review)
    // Lägger den nya recensionen först utan att hämta om allt
    setState(s => ({ ...s, reviews: [saved, ...s.reviews] }))
  }

  const { reviews } = state
  const average = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0

  return { ...state, average, addReview }
}
