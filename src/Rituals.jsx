import { Link } from 'react-router-dom'
import { RITUALS } from './data/catalog'

// Rutnät med ritualer, används på startsidan och på /rituals
function Rituals({ heading = true }) {
  return (
    <section className="rituals wrap" id="rituals">
      {heading && (
        <div className="rituals-head">
          <p className="eyebrow">Shop by ritual</p>
          <h2 className="section-title">Find your moment</h2>
        </div>
      )}
      <div className="ritual-grid">
        {RITUALS.map(r => (
          <Link
            key={r.slug}
            to={`/rituals/${r.slug}`}
            className="ritual-tile"
            // Färgerna kommer från catalog.js via CSS-variabler
            style={{ '--tile-bg': r.colors.body, '--tile-ink': r.colors.ink === '#f3efe6' ? '#f3efe6' : '#2a2522' }}
          >
            <span className="ritual-mood">{r.mood}</span>
            <span className="ritual-name">{r.name}</span>
            <span className="ritual-tagline">{r.tagline}</span>
            <span className="ritual-cta">Discover →</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default Rituals
