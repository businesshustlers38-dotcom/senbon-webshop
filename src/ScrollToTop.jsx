import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// React Router behåller scrollpositionen vid sidbyte.
// Den här komponenten scrollar till toppen varje gång URL:en ändras.
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default ScrollToTop
