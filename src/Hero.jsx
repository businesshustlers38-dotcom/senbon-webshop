function Hero() {
  return (
    <section className="hero">
      <div className="hero-inner">
        <p className="eyebrow eyebrow-light">The Sakura Collection</p>
        <h1 className="hero-title">Turn everyday moments<br />into small rituals</h1>
        <p className="hero-text">Skin care, fragrance and home essentials inspired by the calm of a thousand cherry blossoms.</p>
        {/* Vanlig ankarlänk, scrollar ner till produkterna med id="shop" */}
        <a href="#shop" className="btn btn-light">Shop now</a>
      </div>
    </section>
  )
}

/*
  Hero.jsx Stora bilden högst upp på startsidan
  Bakgrundsbilden sätts i App.css (.hero) så den är lätt att byta
*/

export default Hero
