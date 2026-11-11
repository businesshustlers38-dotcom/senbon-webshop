import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchProduct } from './api'
import { PRODUCTS, getRitual, categoryLabel } from './data/catalog'
import { useCart } from './cartContext'
import { formatPrice } from './format'
import ProductImage from './ProductImage'
import ProductCard from './ProductCard'
import Reviews, { Stars } from './Reviews'
import { useReviews } from './useReviews'

// Liten komponent för betyget högst upp, använder samma hook som Reviews
function RatingLink({ productId }) {
  const { reviews, average } = useReviews(productId)
  if (!reviews.length) return null
  return (
    <a href="#reviews-title" className="rating-link">
      <Stars rating={average} size="0.85rem" /> {reviews.length}
    </a>
  )
}

function Produktside({ onAdded }) {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [result, setResult] = useState({ id: null, product: null, error: null })
  const [qty, setQty] = useState(1)

  useEffect(() => {
    let ignore = false
    fetchProduct(id)
      .then(product => !ignore && setResult({ id, product, error: null }))
      .catch(err => !ignore && setResult({ id, product: null, error: err.message }))
    return () => { ignore = true }
  }, [id])

  if (result.id !== id) return <p className="status">Loading…</p>

  if (result.error) {
    return (
      <div className="status">
        <p>We couldn’t find this product.</p>
        <Link className="btn btn-outline" to="/">Back to shop</Link>
      </div>
    )
  }

  const { product } = result
  const ritual = getRitual(product.ritual)

  // "Complete the ritual": andra produkter från samma ritual
  const related = PRODUCTS.filter(p => p.ritual === product.ritual && p.id !== product.id).slice(0, 4)

  function handleAdd() {
    addToCart(product, qty)
    setQty(1)
    onAdded?.()
  }

  return (
    <>
      <article className="pdp">
        <div className="pdp-image" style={{ '--tint': ritual.colors.bg }}>
          {product.badge && <span className="badge">{product.badge}</span>}
          <ProductImage product={product} />
        </div>

        <div className="pdp-info">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Shop</Link> / <Link to={`/rituals/${ritual.slug}`}>{ritual.name}</Link>
          </nav>
          <p className="eyebrow">{categoryLabel(product.category)} · {product.size}</p>
          <h1 className="pdp-title">{product.name}</h1>
          <RatingLink productId={product.id} />
          <p className="pdp-price">{formatPrice(product.price)}</p>
          <p className="pdp-desc">{product.description}</p>

          <ul className="notes" aria-label="Scent notes">
            {product.notes.map(n => <li key={n}>{n}</li>)}
          </ul>

          <div className="pdp-actions">
            <div className="qty" aria-label="Quantity">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} aria-label="Increase quantity">+</button>
            </div>
            <button className="btn btn-dark pdp-add" onClick={handleAdd}>
              Add to bag · {formatPrice(product.price * qty)}
            </button>
          </div>

          {/* details/summary är ett inbyggt dragspel i HTML, ingen JavaScript behövs */}
          <div className="accordion">
            <details open>
              <summary>How to use</summary>
              <p>{product.howTo}</p>
            </details>
            <details>
              <summary>The ritual</summary>
              <p>{ritual.story}</p>
              <Link to={`/rituals/${ritual.slug}`} className="text-link">Discover {ritual.name} →</Link>
            </details>
            <details>
              <summary>Delivery & returns</summary>
              <p>Free delivery on orders over 499 kr. Delivered in 2–4 working days. Unopened products can be returned within 30 days.</p>
            </details>
          </div>
        </div>
      </article>

      <div className="wrap">
        {/* key gör att Reviews startar om helt när man byter produkt */}
        <Reviews key={product.id} productId={product.id} />
      </div>

      {related.length > 0 && (
        <section className="wrap related">
          <p className="eyebrow">{ritual.name}</p>
          <h2 className="section-title">Complete the ritual</h2>
          <div className="grid">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </>
  )
}

/*
  Produktside.jsx Detaljsida för en produkt

  Vad den gör:
  Hämtar produkten via api.js, visar fel om den inte finns
  Doftnoter, dragspel (How to use, The ritual, Delivery), recensioner
  "Complete the ritual" visar fler produkter från samma ritual = mer försäljning
*/

export default Produktside
