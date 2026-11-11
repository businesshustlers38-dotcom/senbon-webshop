import { createContext, useContext } from 'react'

// Contexten bor i en egen fil så att komponentfilerna bara exporterar komponenter
// (det kräver Vite Fast Refresh, annars laddas sidan om helt vid varje ändring)
export const CartContext = createContext(null)

// Egen hook: useCart() istället för useContext(CartContext) överallt
// Kastar ett tydligt fel om någon glömmer att lägga komponenten inuti <CartProvider>
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart måste användas inuti <CartProvider>')
  return ctx
}
