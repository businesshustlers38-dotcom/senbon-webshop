import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Nav from './Nav'
import Cart from './Cart'
import ProductList from './Producklista'
import Produktside from './Produktside'
import Ordersida from './Orderssida'
import Hero from './Hero'
import Footer from './Footer'
import './App.css'

function App() {
  // Söktexten bor här (EN ägare) så den finns kvar när man går till en produkt och tillbaka
  const [search, setSearch] = useState('')

  // Styr om kundvagnslådan är öppen
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <div className="app">
      <p className="announcement">Free shipping on orders over $50 · Complimentary gift wrapping</p>
      <Nav onCartClick={() => setCartOpen(true)} />

      <Cart open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* React Router styr vilken sida som visas baserat på URL:en */}
      <main className="main">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <ProductList search={search} onSearch={setSearch} />
              </>
            }
          />
          <Route
            path="/product/:id"
            element={<Produktside onAdded={() => setCartOpen(true)} />}
          />
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

  Vad den gör:
  Håller search state så sökningen överlever sidbyten
  Håller cartOpen state för kundvagnslådan
  Kundvagnens data ligger INTE här längre, den finns i CartProvider.jsx
  path="*" fångar alla okända URL:er (404-sida)
*/

export default App
