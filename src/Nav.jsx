import { Link, NavLink } from 'react-router-dom'
import { useCart } from './cartContext'

function Nav({ onCartClick }) {
  const { count } = useCart()

  return (
    <header className="header">
      <nav className="nav">
        <Link to="/" className="brand">
          {/* Logo från public mappen */}
          <img className="brand-logo" src="/Senbonlogo.jpg" alt="" />
          <span className="brand-name">Senbon Zakura</span>
        </Link>

        <ul className="nav-links">
          {/* NavLink får klassen "active" automatiskt när man är på sidan */}
          <li><NavLink className="nav-link" to="/" end>Shop</NavLink></li>
          <li><NavLink className="nav-link" to="/order">Checkout</NavLink></li>
        </ul>

        {/* aria-label hjälper skärmläsare förstå knappen */}
        <button className="cart-button" onClick={onCartClick} aria-label={`Open bag, ${count} items`}>
          Bag
          <span className="cart-count">{count}</span>
        </button>
      </nav>
    </header>
  )
}

/*
  Nav.jsx Navigationsfältet längst upp

  Vad den gör:
  Visar logga, länkar och en knapp som öppnar kundvagnen
  count kommer från CartProvider och visar antal produkter
  Fix: Checkout-länken gick tidigare till "/" istället för "/order"
*/

export default Nav
