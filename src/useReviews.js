import { useState } from 'react'

/*
  useReviews.js Egen hook för recensioner

  Recensionerna sparas i webbläsarens localStorage per produkt.
  Det betyder att bara DU ser dina recensioner (ingen server än).
  Med en riktig backend ändrar du bara den här filen.
*/

function load(key) {
  try {
    const saved = JSON.parse(localStorage.getItem(key))
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

export function useReviews(productId) {
  const key = `senbon-reviews-${productId}`
  const [reviews, setReviews] = useState(() => load(key))

  function addReview(review) {
    const next = [{ ...review, date: new Date().toISOString() }, ...reviews]
    setReviews(next)
    try {
      localStorage.setItem(key, JSON.stringify(next))
    } catch {
      // Sparas inte, men visas ändå tills sidan laddas om
    }
  }

  const average = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0

  return { reviews, average, addReview }
}
