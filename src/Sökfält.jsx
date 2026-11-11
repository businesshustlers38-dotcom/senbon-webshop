import { useState, useEffect } from 'react'

function Sökfält({ value, onSearch }) {
  // Startar med värdet från App, så rutan inte är tom när man kommer tillbaka
  const [text, setText] = useState(value)

  // Debounce: väntar 300ms efter sista tangenttrycket innan filtret uppdateras
  useEffect(() => {
    const timer = setTimeout(() => onSearch(text.trim()), 300)

    // Avbryter föregående timer varje gång användaren skriver
    return () => clearTimeout(timer)
  }, [text, onSearch])

  return (
    <div className="search">
      <label htmlFor="search" className="visually-hidden">Search products</label>
      <input
        id="search"
        type="search"
        className="search-input"
        placeholder="Search products"
        value={text}
        onChange={e => setText(e.target.value)}
      />
    </div>
  )
}

/*
  Sökfält.jsx Sökruta med debounce

  Vad den gör:
  Lokal text state uppdateras vid varje bokstav så rutan känns snabb
  Debounce gör att listan filtreras först när användaren slutat skriva
  Fix: förut startade rutan tom efter sidbyte medan listan fortfarande var filtrerad
  Nu startar den med value från App, så det man ser är alltid det som filtreras
*/

export default Sökfält
