import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchRitual } from './api'
import { categoryLabel } from './data/catalog'
import ProductCard from './ProductCard'
import Rituals from './Rituals'

// Ordningen för stegen i en rutin: först rengöra, sist doft och hem
const STEP_ORDER = ['face', 'body', 'fragrance', 'home']
const STEP_VERB = { face: 'Rengör & vårda', body: 'Ge kroppen omsorg', fragrance: 'Bär din doft', home: 'Skapa stämningen' }

function RitualPage() {
  const { slug } = useParams()
  const [result, setResult] = useState({ slug: null, data: null, error: null })

  useEffect(() => {
    let ignore = false
    fetchRitual(slug)
      .then(data => !ignore && setResult({ slug, data, error: null }))
      .catch(err => !ignore && setResult({ slug, data: null, error: err.message }))
    return () => { ignore = true }
  }, [slug])

  if (result.slug !== slug) return <p className="status">Laddar…</p>
  if (result.error) {
    return (
      <div className="status">
        <p>Den här ritualen finns inte.</p>
        <Link className="btn btn-outline" to="/ritualer">Se alla ritualer</Link>
      </div>
    )
  }

  const { ritual, products } = result.data
  const dark = ritual.colors.ink === '#f3efe6'

  // Grupperar produkterna per kategori för steg-för-steg-rutinen
  const steps = STEP_ORDER
    .map(cat => ({ cat, items: products.filter(p => p.category === cat) }))
    .filter(step => step.items.length > 0)

  return (
    <>
      <header className={`ritual-hero ${dark ? 'is-dark' : ''}`} style={{ '--hero-bg': ritual.colors.body }}>
        <div className="wrap">
          <p className="eyebrow">{ritual.mood} · {ritual.tagline}</p>
          <h1 className="hero-title">{ritual.name}</h1>
          <p className="hero-text">{ritual.story}</p>
        </div>
      </header>

      <section className="wrap steps">
        <h2 className="section-title">Din {ritual.name}-rutin</h2>
        <ol className="step-list">
          {steps.map((step, i) => (
            <li key={step.cat}>
              <span className="step-num">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <strong>{STEP_VERB[step.cat]}</strong>
                <p className="muted">{step.items.map(p => p.name).join(', ')}</p>
              </div>
              <span className="eyebrow">{categoryLabel(step.cat)}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="wrap related">
        <h2 className="section-title">Handla {ritual.name}</h2>
        <div className="grid">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <Rituals heading={false} />
    </>
  )
}

/*
  RitualPage.jsx Sida för en ritual, t.ex. /ritualer/hinoki-forest

  Vad den gör:
  Läser slug från URL:en och hämtar ritualen och dess produkter
  Bygger en steg-för-steg-rutin genom att gruppera produkter per kategori
  Visar alla ritualens produkter och länkar till de andra ritualerna
*/

export default RitualPage
