// 14 kronblad med olika position, storlek och fart så det ser slumpmässigt ut
// Värdena räknas fram EN gång när filen laddas, inte vid varje omritning
const PETALS = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  size: `${10 + (i * 7) % 10}px`,
  duration: `${9 + (i * 5) % 8}s`,
  delay: `${-(i * 1.3)}s`,
}))

function Hero() {
  return (
    <section className="hero">
      {/* Fallande kronblad, aria-hidden eftersom de bara är dekoration */}
      <div className="petals" aria-hidden="true">
        {PETALS.map((p, i) => (
          <span
            key={i}
            className="petal"
            style={{ left: p.left, width: p.size, height: p.size, animationDuration: p.duration, animationDelay: p.delay }}
          />
        ))}
      </div>

      <div className="hero-inner">
        <p className="eyebrow eyebrow-light fade-up">The Sakura Collection</p>
        <h1 className="hero-title fade-up" style={{ animationDelay: '0.15s' }}>
          Turn everyday moments<br />into small rituals
        </h1>
        <p className="hero-text fade-up" style={{ animationDelay: '0.3s' }}>
          Body care, fragrance and home essentials inspired by the calm of a thousand cherry blossoms.
        </p>
        <div className="hero-ctas fade-up" style={{ animationDelay: '0.45s' }}>
          <a href="#shop" className="btn btn-light">Shop now</a>
          <a href="#rituals" className="btn btn-ghost">Explore rituals</a>
        </div>
      </div>
    </section>
  )
}

/*
  Hero.jsx Stora bilden högst upp på startsidan
  fade-up och petal-animationerna finns i App.css
  prefers-reduced-motion stänger av dem för den som vill
*/

export default Hero
