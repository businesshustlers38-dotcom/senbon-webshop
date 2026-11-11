import { useState, useCallback } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Nav from './Nav'
import Cart from './Cart'
import ProductList from './Producklista'
import Produktside from './Produktside'
import Ordersida from './Orderssida'
import Hero from './Hero'
import Rituals from './Rituals'
import RitualPage from './RitualPage'
import Story from './Story'
import OmOss from './OmOss'
import Quiz from './Quiz'
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'
import { formatPrice, FREE_SHIPPING_FROM } from './format'
import './App.css'

function NotFound() {
  return (
    <div className="status">
      <p>Sidan finns inte.</p>
      <Link className="btn btn-outline" to="/">Till butiken</Link>
    </div>
  )
}

function App() {
  // Söktexten bor här (EN ägare) så den finns kvar när man går till en produkt och tillbaka
  const [search, setSearch] = useState('')
  const [cartOpen, setCartOpen] = useState(false)

  // useCallback: samma funktion varje rendering, så Cart:s useEffect inte körs i onödan
  const openCart = useCallback(() => setCartOpen(true), [])
  const closeCart = useCallback(() => setCartOpen(false), [])

  return (
    <div className="app">
      <ScrollToTop />
      <p className="announcement">Fri frakt över {formatPrice(FREE_SHIPPING_FROM)} · Presentinslagning ingår</p>
      <Nav onCartClick={openCart} />
      <Cart open={cartOpen} onClose={closeCart} />

      <main className="main">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Rituals />
                <Story />
                <ProductList search={search} onSearch={setSearch} />
              </>
            }
          />
          <Route path="/ritualer" element={<div className="page-top"><Rituals /></div>} />
          <Route path="/ritualer/:slug" element={<RitualPage />} />
          <Route path="/produkt/:id" element={<Produktside onAdded={openCart} />} />
          <Route path="/hitta-din-ritual" element={<Quiz />} />
          <Route path="/om-oss" element={<OmOss />} />
          <Route path="/kassa" element={<Ordersida />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

/*
  App.jsx Huvudfilen, bestämmer layout och sidor

  Sidor:
  /                   Startsida: hero, ritualer, berättelse, butik
  /ritualer           Alla ritualer
  /ritualer/:slug     En ritual med rutin och produkter
  /produkt/:id        Produktsida
  /hitta-din-ritual   Quiz
  /om-oss             Om oss
  /kassa              Kassa
  *                   404
*/

export default App
