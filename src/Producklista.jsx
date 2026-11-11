import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts, CATEGORIES, categoryLabel } from './api'
import { useCart } from './cartContext'
import { formatPrice } from './format'
import Sökfält from './Sökfält'

function ProductList({ search, onSearch }) {
  const { addToCart } = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [category, setCategory] = useState('all')

  // Ökas för att köra hämtningen igen när man klickar "Try again"
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    // AbortController avbryter hämtningen om komponenten försvinner
    const controller = new AbortController()

    async function load() {
      setLoading(true)
      setError(null)
      try {
        setProducts(await fetchProducts(controller.signal))
      } catch (err) {
        // AbortError är inget riktigt fel, vi avbröt själva
        if (err.name !== 'AbortError') setError(err.message)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [retry])

  // Filtrerar på kategori OCH söktext (titel, varumärke eller kategori)
  const query = search.toLowerCase()
  const filtered = products.filter(p => {
    const inCategory = category === 'all' || p.category === category
    const text = `${p.title} ${p.brand ?? ''} ${p.category}`.toLowerCase()
    return inCategory && text.includes(query)
  })

  return (
    <section className="shop" id="shop">
      <div className="shop-head">
        <h2 className="section-title">Shop the rituals</h2>
        <Sökfält value={search} onSearch={onSearch} />
      </div>

      {/* Kategoriknappar, aria-pressed berättar för skärmläsare vilken som är vald */}
      <div className="chips" role="group" aria-label="Filter by category">
        {[{ slug: 'all', label: 'All' }, ...CATEGORIES].map(c => (
          <button
            key={c.slug}
            className="chip"
            aria-pressed={category === c.slug}
            onClick={() => setCategory(c.slug)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {loading && <p className="status">Loading products…</p>}

      {error && (
        <div className="status">
          <p>Could not load products ({error}).</p>
          <button className="btn btn-outline" onClick={() => setRetry(r => r + 1)}>Try again</button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p className="status">No products match “{search}”.</p>
      )}

      <div className="grid">
        {filtered.map(product => (
          <article key={product.id} className="card">
            <Link to={`/product/${product.id}`} className="card-media">
              <img src={product.thumbnail} alt={product.title} loading="lazy" />
            </Link>
            <div className="card-body">
              <p className="eyebrow">{categoryLabel(product.category)}</p>
              <h3 className="card-title">
                <Link to={`/product/${product.id}`}>{product.title}</Link>
              </h3>
              <p className="price">{formatPrice(product.price)}</p>
            </div>
            <button className="btn btn-dark card-btn" onClick={() => addToCart(product)}>
              Add to bag
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

/*
  Producklista.jsx Visar produkter från DummyJSON

  Vad den gör:
  Hämtar bara vardagskategorier (hudvård, skönhet, doft, hem) via api.js
  AbortController stoppar anropet om användaren lämnar sidan
  "Try again" kör hämtningen igen genom att ändra retry
  Filtrerar på både kategori och söktext
  Fix: förut hämtades bara 30 produkter, nu hämtas alla i valda kategorier
*/

export default ProductList
