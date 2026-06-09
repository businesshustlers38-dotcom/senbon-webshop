import { useState, useEffect } from "react"

function Sökfält({onSearch}) {

   // State för vad användaren skriver i sökfältet
  const [search, setSearch] = useState ('')

  // Debounce körs varje gång search ändras
  useEffect (() => {
    const timer = setTimeout(() => {
  
      // Anropar onSearch från App.jsx efter 500ms
      onSearch(search) 
      } ,500)

  

  // Avbryter föregående timer varje gång användaren skriver
    // Detta är kärnan i debounce bara den sista timern körs
      return () => clearTimeout(timer)
  }, [search])

  return (
    
    <div>

    {/* Uppdaterar search state varje gång användaren skriver */}
      <input placeholder="Search engine products"
      value={search}
      onChange={(e) => setSearch(e.target.value)} />
    </div>
  )

  
}

/*
  Sökfält.jsx Sökruta med debounce

  Vad den gör:
  useState håller koll på vad användaren skriver
  useEffect med debounce väntar 500ms efter att användaren slutat skriva
  clearTimeout avbryter föregående timer varje gång användaren skriver
  Utan clearTimeout skulle varje bokstav skicka ett API-anrop
  Med debounce skickas bara ett anrop efter att användaren slutat skriva

  Props den tar emot:
  onSearch från App.jsx funktionen som uppdaterar search state i App
*/

export default Sökfält