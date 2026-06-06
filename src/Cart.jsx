
import { Link } from "react-router-dom"
function Cart ({cart}) {
  return (
    <div>
      <h2>Cart</h2> 

       {/* Länk till orderöversikten utan att ladda om sidan */}   
      <Link to={"/order"}> Forsätt med ordern </Link>

       {/* Loopar igenom kundvagnen och visar varje produkt */}
      {/* Använder index som nyckel eftersom samma produkt kan läggas till flera gånger */}
      {cart.map((item,index) => (
        <p key={index}>{item.title} - ${item.price}</p>
    
      ))}
    </div>
  )
}

export default Cart