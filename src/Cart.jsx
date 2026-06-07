
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

export default Cart