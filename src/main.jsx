
// Här är startpunkten för hela react koden
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

// Div hittas som id "root" i index.html och låter react ta över den
// BrowserRouter den aktiverar React Router och säger till att URL:en kan ändras utan omladdning
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </StrictMode>,
)
