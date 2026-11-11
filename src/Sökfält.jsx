import { useState, useEffect } from 'react'

function Sökfält({ value, onSearch }) {
  // Startar med värdet från App, så rutan inte är tom när man kommer tillbaka
  const [text, setText] = useState(value)

  // Debounce: väntar 300ms efter sista tangenttrycket innan filtret uppdateras
  useEffect(() => {
    const timer = setTimeout(() => onSearch(text.trim()), 300)
    return () => clearTimeout(timer)
  }, [text, onSearch])

  return (
    <div className="search">
      <label htmlFor="search" className="visually-hidden">Sök produkter</label>
      <input
        id="search"
        type="search"
        className="search-input"
        placeholder="Sök produkt eller doft"
        value={text}
        onChange={e => setText(e.target.value)}
      />
    </div>
  )
}

/*
  Sökfält.jsx Sökruta med debounce
  Lokal text uppdateras vid varje bokstav, listan filtreras först efter 300ms paus
*/

export default Sökfält
