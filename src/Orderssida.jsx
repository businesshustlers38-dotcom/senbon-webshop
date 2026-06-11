import { useContext, useState } from "react";
import { CartContext } from "./App";

function Ordersida () {

  const {cart} = useContext(CartContext)

   // State för namn och adress från formuläret
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')

  // State för om ordern är bekräftad
  const [confirmed, setConfrimed] = useState(false) 

  
  // Räknar ut totalpriset med reduce
  // Börjar på 0 och adderar varje produkts pris ett i taget
 const total = cart.reduce((sum, item) => sum + item.price, 0)


 
 function handelorder () {

   // Funktion som bekräftar ordern om namn och adress är ifyllda   
    if (name && address) {
      setConfrimed(true)
    }
  }

  // Visar bekräftelsemeddelande när ordern är lagd
  if (confirmed) {
    
    return (
    <div className="order-confirmed">
    <p>Order confirmed for {name}! Total: ${total.toFixed(2)}</p>
  </div>
    )
  }
  return  (
  
  <div className="order-page">

    <div className="order-card">

      <h2>Order Overview</h2>
      {cart.length === 0 ? (
        <p className="order-empty">Din Kundvagn är tom.</p>
      ): (
        
        <ul className="order-items">
          {cart.map((item, index) => (
            <li key={index} className="order-item">
              <span>{item.title}</span>
              <span>{item.price}</span>

            </li>
          ))}
        </ul>
      )}

      
  
       {/* Totalpriset formaterat till två decimaler */}

      <p className="order-total">Total: ${total.toFixed(2)}</p>

      <div className="order-form">

       {/* Formulär för personliga uppgifter */}
      <input className="order-input" placeholder="Ditt namn" value={name} onChange={e => setName(e.target.value)}/>
      <input className="order-input" placeholder="Din address" value={address} onChange={e => setAddress(e.target.value) }/>

         {/* Bekräftar ordern när knappen klickas */}
      <button className="order-btn" onClick={handelorder}>Placera ordern</button>
  </div> 
  
   </div>

    </div>
  )
}

/*
  Ordersida.jsx Orderöversikt och kassan

  Vad den gör:
  Visar alla produkter i kundvagnen med pris
  reduce räknar ut totalpriset genom att addera alla priser
  toFixed(2) formaterar priset till två decimaler
  handleOrder kollar att namn och adress är ifyllda innan bekräftelse
  confirmed state byter vy till bekräftelsemeddelande när ordern är lagd

  Props den tar emot:
  cart från App.jsx arrayen med alla valda produkter
*/
export default Ordersida