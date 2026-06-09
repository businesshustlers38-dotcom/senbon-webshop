import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

function Produktside () {

   // useParams läser id från URL:en om URL:en är /product/5 blir id = 5
  const { id } = useParams()

   // State för den enskilda produkten
  const [product, setProduct] = useState(null)

  // Körs varje gång id ändras i URL:en
  useEffect (() => {

     // Hämtar specifik produkt baserat på id från URL:en
    async function fetchProducts() {

      const res = await fetch(`https://dummyjson.com/products/${id}`)
       const data = await res.json()
       setProduct(data)
    
      
    }
    fetchProducts ()
  }, [id])

  // Visar laddningsmeddelande tills produkten är hämtad
  if (!product) return <p>Loading...</p>

  return (
    <div>
      <h2>{product.title}</h2>
       <img src={product.thumbnail} alt={product.title} width="200" />
       <p>{product.description}</p>
       <p>${product.price}</p>
    </div>
  )


}

/*
  Produktside.jsx Visar detaljerad information om en specifik produkt

  Vad den gör:
  useParams läser id från URL:en, till exempel /product/5 ger id = 5
  useEffect hämtar produktdata från API:et baserat på id
   Körs igen varje gång id ändras i URL:en
  Visar laddningsmeddelande tills produkten är hämtad

  Ingen props hämtar all data direkt från API:et via URL:en
*/

export default Produktside