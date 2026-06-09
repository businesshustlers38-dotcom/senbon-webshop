
import { Link } from "react-router-dom"



function Cart ({cart, removeFromCart}) {
  return (
    <div>
      <h2>Cart</h2> 

       {/* Länk till orderöversikten utan att ladda om sidan */}   
      <Link to={"/order"}> Forsätt med ordern </Link>

       {/* Loopar igenom kundvagnen och visar varje produkt */}
      {/* Använder index som nyckel eftersom samma produkt kan läggas till flera gånger */}

      
      {cart.map((item,index) => (
      
      <div key={index}>

        <p key={index}>{item.title} - ${item.price}</p>
       {/*  removeFromCart gör att man ta bort en vis produkt från kundvagn */}
       <button onClick={() => removeFromCart(index)}>Ta bort</button>
        </div>
  ))}

      
    </div>
  )
}

/*
  Cart.jsx Visar produkter i kundvagnen

  Vad den gör:
 Loopar igenom cart arrayen och visar varje produkts namn och pris
 Använder index som key eftersom samma produkt kan läggas till flera gånger
 Ta bort knappen anropar removeFromCart med produktens position
 Link navigerar till ordersidan utan att ladda om sidan

  Props den tar emot:
  cart från App.jsx arrayen med alla valda produkter
  removeFromCart från App.jsx funktionen som tar bort en produkt
*/

export default Cart