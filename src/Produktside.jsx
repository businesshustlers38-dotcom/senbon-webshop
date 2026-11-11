import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchProduct, categoryLabel } from './api'
import { useCart } from './cartContext'
import { formatPrice } from './format'

function Produktside({ onAdded }) {
  // useParams läser id från URL:en, /product/5 ger id = 5
  const { id } = useParams()
  const { addToCart } = useCart()

  // Ett state-objekt för hela hämtningen: data, fel och vilket id det gäller
  const [result, setResult] = useState({ id: null, product: null, error: null })
  const [qty, setQty] = useState(1)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    fetchProduct(id, controller.signal)
      .then(product => setResult({ id, product, error: null }))
      .catch(err => {
        if (err.name !== 'AbortError') setResult({ id, product: null, error: err.message })
      })

    return () => controller.abort()
  }, [id])

  // Om result gäller ett annat id än URL:en håller vi fortfarande på att ladda
  if (result.id !== id) return <p className="status">Loading…</p>

  if (result.error) {
    return (
      <div className="status">
        <p>We couldn’t find this product ({result.error}).</p>
        <Link className="btn btn-outline" to="/">Back to shop</Link>
      </div>
    )
  }

  const { product } = result
  const images = product.images?.length ? product.images : [product.thumbnail]

  function handleAdd() {
    addToCart(product, qty)
    setQty(1)
    onAdded?.()
  }

  return (
    <article className="pdp">
      <div className="pdp-gallery">
        <div className="pdp-image">
          <img src={images[activeImage] ?? images[0]} alt={product.title} />
        </div>
        {images.length > 1 && (
          <div className="pdp-thumbs">
            {images.map((src, i) => (
              <button
                key={src}
                className="pdp-thumb"
                aria-pressed={i === activeImage}
                aria-label={`Show image ${i + 1}`}
                onClick={() => setActiveImage(i)}
              >
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="pdp-info">
        <Link to="/" className="back-link">← Back to shop</Link>
        <p className="eyebrow">{categoryLabel(product.category)}{product.brand && ` · ${product.brand}`}</p>
        <h1 className="pdp-title">{product.title}</h1>
        <p className="pdp-price">{formatPrice(product.price)}</p>
        <p className="pdp-desc">{product.description}</p>

        <div className="pdp-actions">
          <div className="qty" aria-label="Quantity">
            <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
            <span>{qty}</span>
            <button onClick={() => setQty(q => q + 1)} aria-label="Increase quantity">+</button>
          </div>
          <button className="btn btn-dark pdp-add" onClick={handleAdd}>Add to bag</button>
        </div>

        <ul className="pdp-meta">
          {product.shippingInformation && <li>{product.shippingInformation}</li>}
          {product.returnPolicy && <li>{product.returnPolicy}</li>}
        </ul>
      </div>
    </article>
  )
}

/*
  Produktside.jsx Detaljsida för en produkt

  Vad den gör:
  Hämtar produkten via api.js baserat på id i URL:en
  Fix: förut visades "Loading..." för alltid om något gick fel, nu visas felet
  Bildgalleri, antalsväljare och "Add to bag" som öppnar kundvagnen
  result.id !== id betyder att vi bytt produkt och väntar på ny data
*/

export default Produktside
