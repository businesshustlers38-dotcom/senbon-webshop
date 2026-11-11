import { useState, useCallback } from 'react'
import { Routes, Route } from 'react-router-dom'
import Nav from './Nav'
import Cart from './Cart'
import ProductList from './Producklista'
import Produktside from './Produktside'
import Ordersida from './Orderssida'
import Hero from './Hero'
import Rituals from './Rituals'
import RitualPage from './RitualPage'
import Story from './Story'
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'
import './App.css'

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
      <p className="announcement">Free delivery on orders over 499 kr · Complimentary gift wrapping</p>
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
          <Route path="/rituals" element={<div className="page-top"><Rituals /></div>} />
          <Route path="/rituals/:slug" element={<RitualPage />} />
          <Route path="/product/:id" element={<Produktside onAdded={openCart} />} />
          <Route path="/order" element={<Ordersida />} />
          <Route path="*" element={<p className="status">Page not found.</p>} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

/*
  App.jsx Huvudfilen, bestämmer layout och sidor

  Sidor:
  /                  Startsida: hero, ritualer, berättelse, butik
  /rituals           Alla ritualer
  /rituals/:slug     En ritual med rutin och produkter
  /product/:id       Produktsida
  /order             Kassa
  *                  404
*/

export default App
