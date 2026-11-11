
// Här är startpunkten för hela react koden
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import CartProvider from './CartProvider'

// Div hittas som id "root" i index.html och låter react ta över den
// BrowserRouter aktiverar React Router så URL:en kan ändras utan omladdning
// CartProvider ligger runt hela appen så alla komponenter når kundvagnen
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
)
