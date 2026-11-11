import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchProduct } from './api'
import { PRODUCTS, getRitual, getProduct, categoryLabel, setValue } from './data/catalog'
import { useCart } from './cartContext'
import { formatPrice, FREE_SHIPPING_FROM } from './format'
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

  if (result.id !== id) return <p className="status">Laddar…</p>

  if (result.error) {
    return (
      <div className="status">
        <p>Vi hittade inte den här produkten.</p>
        <Link className="btn btn-outline" to="/">Tillbaka till butiken</Link>
      </div>
    )
  }

  const { product } = result
  const ritual = getRitual(product.ritual)

  // Presentset: vad ingår och hur mycket sparar kunden?
  const contents = product.contents?.map(getProduct).filter(Boolean) ?? []
  const saving = setValue(product) - product.price

  // "Fullborda ritualen": andra produkter från samma ritual
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
          <nav className="breadcrumb" aria-label="Brödsmulor">
            <Link to="/">Butik</Link> / <Link to={`/ritualer/${ritual.slug}`}>{ritual.name}</Link>
          </nav>
          <p className="eyebrow">{categoryLabel(product.category)} · {product.size}</p>
          <h1 className="pdp-title">{product.name}</h1>
          <RatingLink productId={product.id} />
          <p className="pdp-price">
            {formatPrice(product.price)}
            {saving > 0 && <span className="saving">Spara {formatPrice(saving)}</span>}
          </p>
          <p className="pdp-desc">{product.description}</p>

          {contents.length > 0 && (
            <div className="set-contents">
              <p className="eyebrow">Det här ingår</p>
              <ul>
                {contents.map(item => (
                  <li key={item.id}>
                    <Link to={`/produkt/${item.id}`}>{item.name}</Link>
                    <span className="muted">{item.size}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <ul className="notes" aria-label="Doftnoter">
            {product.notes.map(n => <li key={n}>{n}</li>)}
          </ul>

          <div className="pdp-actions">
            <div className="qty" aria-label="Antal">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Minska antal">−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} aria-label="Öka antal">+</button>
            </div>
            <button className="btn btn-dark pdp-add" onClick={handleAdd}>
              Lägg i kassen · {formatPrice(product.price * qty)}
            </button>
          </div>

          {/* details/summary är ett inbyggt dragspel i HTML, ingen JavaScript behövs */}
          <div className="accordion">
            <details open>
              <summary>Så använder du</summary>
              <p>{product.howTo}</p>
            </details>
            <details>
              <summary>Ritualen</summary>
              <p>{ritual.story}</p>
              <Link to={`/ritualer/${ritual.slug}`} className="text-link">Upptäck {ritual.name} →</Link>
            </details>
            <details>
              <summary>Leverans & retur</summary>
              <p>Fri frakt över {formatPrice(FREE_SHIPPING_FROM)}. Leverans inom 2–4 arbetsdagar. Oöppnade produkter kan returneras inom 30 dagar.</p>
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
          <h2 className="section-title">Fullborda ritualen</h2>
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
  Presentset visar innehåll och hur mycket kunden sparar
  Doftnoter, dragspel, recensioner och "Fullborda ritualen"
*/

export default Produktside
