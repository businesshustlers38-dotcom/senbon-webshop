import { useState, useEffect } from "react"

function Sökfält({onSearch}) {

   // State för vad användaren skriver i sökfältet
  const [search, setSearch] = useState ('')

  // Debounce - körs varje gång search ändras
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

    {/* Uppdaterar search-state varje gång användaren skriver */}
      <input placeholder="Search engine products"
      value={search}
      onChange={(e) => setSearch(e.target.value)} />
    </div>
  )

  
}

export default Sökfält