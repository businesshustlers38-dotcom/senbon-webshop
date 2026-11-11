import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from './cartContext'
import { formatPrice } from './format'

function Cart({ open, onClose }) {
  const { cart, subtotal, setQty, removeFromCart } = useCart()

  // Stänger lådan med Escape-tangenten och låser scroll bakom den
  useEffect(() => {
    if (!open) return
    const onKey = e => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <>
      {/* Mörk bakgrund, klick på den stänger lådan */}
      <div className={`drawer-overlay ${open ? 'is-open' : ''}`} onClick={onClose} />

      <aside
        className={`drawer ${open ? 'is-open' : ''}`}
        aria-hidden={!open}
        aria-label="Shopping bag"
        inert={!open}
      >
        <div className="drawer-head">
          <h2>Your bag</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close bag">✕</button>
        </div>

        {cart.length === 0 ? (
          <p className="drawer-empty">Your bag is empty.</p>
        ) : (
          <ul className="drawer-items">
            {/* Produktens id som key, nu finns varje produkt bara en gång */}
            {cart.map(item => (
              <li key={item.id} className="line">
                <img src={item.thumbnail} alt="" className="line-img" />
                <div className="line-info">
                  <p className="line-title">{item.title}</p>
                  <p className="line-price">{formatPrice(item.price)}</p>
                  <div className="qty qty-sm">
                    <button onClick={() => setQty(item.id, item.qty - 1)} aria-label={`Decrease ${item.title}`}>−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => setQty(item.id, item.qty + 1)} aria-label={`Increase ${item.title}`}>+</button>
                  </div>
                </div>
                <button className="link-btn" onClick={() => removeFromCart(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
        )}

        <div className="drawer-foot">
          <div className="row">
            <span>Subtotal</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>
          {cart.length > 0 && (
            <Link to="/order" className="btn btn-dark btn-block" onClick={onClose}>
              Checkout
            </Link>
          )}
        </div>
      </aside>
    </>
  )
}

/*
  Cart.jsx Kundvagnen som en låda som glider in från höger

  Vad den gör:
  Visar varje produkt en gång med antal (+ / −)
  Remove tar bort produkten helt, − på 1 tar också bort den
  Escape eller klick utanför stänger lådan
  inert gör att man inte kan tabba in i lådan när den är stängd
*/

export default Cart
