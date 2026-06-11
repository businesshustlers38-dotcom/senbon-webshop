import { useState, createContext } from 'react'
import Sökfält from './Sökfält'
import ProductList from './Producklista'
import Cart from './Cart'
import { Routes, Route, useLocation } from 'react-router-dom'
import Produktside from './Produktside'
import Ordersida from './Orderssida'
import './App.css'
import Nav from './Nav'
export const CartContext = createContext()

function App() {

  // Här har jag skapat state för söktexten och börjar som en sträng
    const [search, setSearch] = useState ('')

  // Det här state för kundvagen som börjar med en array
    const [cart, setCart] = useState ([])
    const location = useLocation()

  // Den här funktionen säger till att kunden lägger produkt i kundevagen
  // ...cart säger till att den kopirerar befintliga produkter och lägger den nya 
  // produkten med andra som finns med i vagnen
    function addToCart(product) {
      setCart([...cart, product])

    
    }
 
  // funktionen säger att tar bor en vis produkt från kundvagnen
      function removeFromCart(index) {
        const newCart = cart.filter((_, i) => i !== index)
        setCart(newCart)
      }
  return (
  
     <CartContext.Provider value={{cart, addToCart, removeFromCart}}>
      
        <div>
            
            <Nav />

      {/* Sökfältet skickar setSearch som prop så det kan uppdatera search state i App.jsx */}
        {location.pathname === '/' && <Sökfält onSearch={setSearch}/>}   

       {/* Kundvagnen tar emot cart arrayen som prop */}
        <Cart />

        {/* React Router styr vilken sida som visas baserat på URL:en */}
        <Routes>

       {/* Startsidan visar produktlistan */}
        <Route path='/' element={
      <ProductList search={search} addToCart = {addToCart}/>  } />

     {/* Produktsidan :id är dynamiskt och ändras beroende på vilken produkt man klickar på */}    
      <Route path='/product/:id' element= {<Produktside/>} />

        {/* Orderöversikten tar emot kundvagnen som prop */}
      <Route path='/order' element={<Ordersida/>}/>
     </Routes>
  </div>
  
  </CartContext.Provider>
  )
}

/*
  App.jsx Huvudfilen och föräldern till alla komponenter

  Vad den gör:
  Håller cart state så både Producklista och Cart kan använda den
  Håller search state så Sökfält och Producklista kan använda den
  addToCart lägger till produkter i kundvagnen med spread operator ...cart
  removeFromCart tar bort produkter med filter baserat på position
  React Router styr vilken sida som visas baserat på URL:en

  Props som skickas ned:
  search och addToCart skickas till Producklista
  cart och removeFromCart skickas till Cart
  cart skickas till Ordersida
*/

export default App
