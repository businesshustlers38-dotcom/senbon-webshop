import { useState, useEffect } from 'react'
import { fetchProducts } from './api'
import { CATEGORIES, getRitual } from './data/catalog'
import ProductCard from './ProductCard'
import Sökfält from './Sökfält'

// Sorteringsalternativ: varje alternativ har en jämförelsefunktion
const SORTS = {
  featured: { label: 'Utvalda', compare: () => 0 },
  'price-asc': { label: 'Pris: lägst först', compare: (a, b) => a.price - b.price },
  'price-desc': { label: 'Pris: högst först', compare: (a, b) => b.price - a.price },
  name: { label: 'Namn A–Ö', compare: (a, b) => a.name.localeCompare(b.name, 'sv') },
}

function ProductList({ search, onSearch }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('featured')

  useEffect(() => {
    // ignore: om komponenten försvinner innan svaret kommer sparar vi inget
    let ignore = false
    fetchProducts()
      .then(data => !ignore && setProducts(data))
      .catch(err => !ignore && setError(err.message))
      .finally(() => !ignore && setLoading(false))
    return () => { ignore = true }
  }, [])

  // Söker i namn, ritual och doftnoter, så "yuzu" hittar alla yuzu-produkter
  const query = search.toLowerCase()
  const visible = products
    .filter(p => category === 'all' || p.category === category)
    .filter(p => {
      const text = [p.name, getRitual(p.ritual).name, ...p.notes].join(' ').toLowerCase()
      return text.includes(query)
    })
    // [...] kopierar arrayen först, sort() ändrar annars originalet
  const sorted = [...visible].sort(SORTS[sort].compare)

  return (
    <section className="shop" id="shop">
      <div className="shop-head">
        <div>
          <p className="eyebrow">Alla produkter</p>
          <h2 className="section-title">Vardagens favoriter</h2>
        </div>
        <Sökfält value={search} onSearch={onSearch} />
      </div>

      <div className="toolbar">
        <div className="chips" role="group" aria-label="Filtrera på kategori">
          {[{ slug: 'all', label: 'Alla' }, ...CATEGORIES].map(c => (
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

        <label className="sort">
          <span className="visually-hidden">Sortera produkter</span>
          <select value={sort} onChange={e => setSort(e.target.value)}>
            {Object.entries(SORTS).map(([key, s]) => (
              <option key={key} value={key}>{s.label}</option>
            ))}
          </select>
        </label>
      </div>

      {loading && <p className="status">Laddar produkter…</p>}
      {error && <p className="status">Produkterna kunde inte laddas ({error}).</p>}
      {!loading && !error && sorted.length === 0 && (
        <p className="status">Inga produkter matchar ”{search}”.</p>
      )}

      {!loading && sorted.length > 0 && <p className="muted small result-count">{sorted.length} produkter</p>}

      <div className="grid">
        {sorted.map(product => <ProductCard key={product.id} product={product} />)}
      </div>
    </section>
  )
}

/*
  Producklista.jsx Butiken

  Vad den gör:
  Hämtar produkter från api.js (som läser vår egen catalog.js)
  Filtrerar på kategori och söktext, sorterar med valt alternativ
  ProductCard ritar varje kort, samma komponent används på flera sidor
*/

export default ProductList
