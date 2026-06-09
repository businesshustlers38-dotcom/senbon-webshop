import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function ProductList({search, addToCart}) {

  // State för produkterna från API:et
  const [products, setproducts] = useState ([])

  // State för laddningsstatus börjar som true eftersom vi alltid laddar vid start
  const [loading, setLoading] = useState(true)

  // State för felmeddelande börjar som null vilket betyder inget fel
  const [error, setError] = useState(null)

  // useEffect med tom array [] körs en gång när komponenten laddas
  useEffect (() => { 
    
    // Async funktion för att hämta produkter från DummyJSON API
    async function fetchProducts() {
  
      try {   
        const res = await fetch('https://dummyjson.com/products')

         // Kollar om svaret var lyckat fetch kastar inte fel automatiskt för 404
        if (!res.ok) throw new  Error(`HTTP Error: ${res.status}`)

        // Omvandlar svaret till ett JavaScript objekt
        const data = await res.json()

        
        // Sparar produkterna i state vilket triggar en omritning
        setproducts(data.products)
      } catch (err) { 
        
      // Om något går fel sparas felmeddelandet i state
        setError(err.message)
      } finally {

      // Körs alltid oavsett om det lyckades eller misslyckades
        setLoading(false)
      }
    }

  // Anropar funktionen direkt kan inte sätta async på useEffect callbacken    
   fetchProducts() 
 },[])





// Filtrerar produkterna baserat på söktexten
// toLowerCase på båda sidor gör sökningen skiftlägesokänslig
const filtered = products.filter(product => product.title.toLowerCase()
.includes(search.toLowerCase()))

 // Visar laddningsmeddelande medan data hämtas
if (loading) return <p>Loading products...</p>

 // Visar felmeddelande om något gick fel
if (error)   return <p>Error: {error}</p>


return (
 
  <div>

    <h2>Products</h2>
    
    <div id="products">

  {/* Loopar igenom filtrerade produkter och skapar ett kort för varje */}
    {filtered.map(product => (


    <div key={product.id} className="card">
     
      <img src={product.thumbnail} alt={product.title} width="100" />

      {/* Länk till produktsidan med produktens id i URL:en */}

      <Link to={`/product/${product.id}`}>{product.title}</Link>

      <p>${product.price}</p> 
      
       {/* Anropar addToCart från App.jsx när knappen klickas */}
       <button onClick={() => addToCart(product)} >Add to Cart</button>
      
      </div>

  
    ))}

  </div>

    </div>
)
}

/*
  Producklista.jsx Visar alla produkter från DummyJSON API

  Vad den gör:
  useEffect hämtar produkter från API:et en gång när sidan laddas
  try/catch/finally hanterar fel om API:et inte svarar
  loading state visar laddningsmeddelande medan data hämtas
  error state visar felmeddelande om något går fel
  filter filtrerar produkter baserat på söktexten från App.jsx
  map loopar igenom produkterna och skapar ett kort för varje

  Props den tar emot:
  search från App.jsx för att filtrera produkter
  addToCart från App.jsx för att lägga till i kundvagnen
*/

export default ProductList