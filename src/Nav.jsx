import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useCart } from './cartContext'

const LINKS = [
  { to: '/', label: 'Butik', end: true },
  { to: '/ritualer', label: 'Ritualer' },
  { to: '/hitta-din-ritual', label: 'Hitta din ritual' },
  { to: '/om-oss', label: 'Om oss' },
]

function Nav({ onCartClick }) {
  const { count } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  // Enkelt är bättre än smart: menyn stängs när man klickar på en länk
  const closeMenu = () => setIsOpen(false)

  return (
    <header className="header">
      <nav className="nav" aria-label="Huvudmeny">
        <button
          className="menu-button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="nav-links"
        >
          {isOpen ? 'Stäng' : 'Meny'}
        </button>

        <Link to="/" className="brand" onClick={closeMenu}>
          <img className="brand-logo" src="/Senbonlogo.jpg" alt="" />
          <span className="brand-name">Senbon Zakura</span>
        </Link>

        <ul id="nav-links" className={`nav-links ${isOpen ? 'is-open' : ''}`}>
          {LINKS.map(l => (
            <li key={l.to}>
              <NavLink className="nav-link" to={l.to} end={l.end} onClick={closeMenu}>{l.label}</NavLink>
            </li>
          ))}
        </ul>

        <button className="cart-button" onClick={onCartClick} aria-label={`Öppna kassen, ${count} produkter`}>
          Kassen
          <span className="cart-count">{count}</span>
        </button>
      </nav>
    </header>
  )
}

/*
  Nav.jsx Navigationsfältet längst upp
  På mobil döljs länkarna bakom en Meny-knapp (aria-expanded berättar för skärmläsare)
*/

export default Nav
