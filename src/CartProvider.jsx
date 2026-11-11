import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { CartContext } from './cartContext'

// v2: formatet ändrades när vi bytte från DummyJSON till egen katalog.
// Ny nyckel = gamla, inkompatibla kundvagnar ignoreras istället för att krascha sidan.
const STORAGE_KEY = 'senbon-cart-v2'

// Kundvagnen sparar FAKTA (vilken produkt + hur många), inte klick.
// Förut: [tvål, tvål, tvål]  →  Nu: [{ id: 'hinoki-bar-soap', qty: 3 }]
function cartReducer(state, action) {
  switch (action.type) {
    case 'add': {
      const { product, qty } = action
      const existing = state.find(item => item.id === product.id)

      // Finns produkten redan? Öka antalet istället för att lägga till en ny rad
      if (existing) {
        return state.map(item =>
          item.id === product.id ? { ...item, qty: item.qty + qty } : item
        )
      }

      // Sparar bara fälten vi behöver, inte hela API-objektet
      return [
        ...state,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          size: product.size,
          shape: product.shape,
          ritual: product.ritual,
          qty,
        },
      ]
    }

    case 'setQty':
      // Antal 0 eller mindre betyder att produkten tas bort
      if (action.qty <= 0) return state.filter(item => item.id !== action.id)
      return state.map(item =>
        item.id === action.id ? { ...item, qty: action.qty } : item
      )

    case 'remove':
      return state.filter(item => item.id !== action.id)

    case 'clear':
      // Returnerar samma state om kassen redan är tom, så React slipper rita om
      return state.length === 0 ? state : []

    default:
      return state
  }
}

// Läser sparad kundvagn från localStorage när sidan startar
// try/catch: localStorage kan vara blockerat (privat läge) eller innehålla trasig JSON
function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, [], loadCart)

  // Sparar kundvagnen varje gång den ändras så den överlever omladdning
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
    } catch {
      // Om sparandet misslyckas fungerar kundvagnen ändå, bara utan minne
    }
  }, [cart])

  // clearCart får samma identitet varje gång (useCallback), så den kan ligga i en useEffect
  const clearCart = useCallback(() => dispatch({ type: 'clear' }), [])

  // useMemo: räknar bara om när cart ändras, inte vid varje omritning
  const value = useMemo(() => {
    const count = cart.reduce((sum, item) => sum + item.qty, 0)
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

    return {
      cart,
      count,
      subtotal,
      addToCart: (product, qty = 1) => dispatch({ type: 'add', product, qty }),
      setQty: (id, qty) => dispatch({ type: 'setQty', id, qty }),
      removeFromCart: id => dispatch({ type: 'remove', id }),
      clearCart,
    }
  }, [cart, clearCart])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

/*
  CartProvider.jsx Äger all kundvagnsdata

  Vad den gör:
  useReducer samlar alla sätt att ändra kundvagnen på ETT ställe (add, setQty, remove, clear)
  Samma produkt två gånger ökar qty istället för att skapa dubbletter
  localStorage gör att kundvagnen finns kvar efter omladdning
  count och subtotal räknas fram från cart, de sparas aldrig separat

  Regel att komma ihåg: varje fakta har EN ägare, allt annat räknas fram
*/

export default CartProvider
