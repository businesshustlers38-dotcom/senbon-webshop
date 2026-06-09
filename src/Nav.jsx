import { Link } from "react-router-dom";

function Nav() {
  
   // Jag använder min gamla CSS-klasser från den gamla Senbonzakura projekt
  return (
    <header className="Huvudsidan">
     <nav className="Meny">

       {/* Logo från public mappen */}
      <img className="nav-logo" src="/Senbonlogo.jpg" alt="Senbon Zakura logo" />
      
      <ul className="Meny-lista">
        
 {/* Link från React Router navigerar utan att ladda om sidan */}
        <li><Link className="nav-länk" to="/">Hem</Link></li>
          <li><Link className="nav-länk" to="/">Ordern</Link></li>

      </ul>

     </nav>
    </header>
  )
}

/*
  Nav.jsx Navigationsfältet längst upp på sidan

  Vad den gör:
  Visar logotypen och navigeringslänkar
  Link från React Router navigerar utan att ladda om sidan
  Använder CSS-klasser från App.css för styling

  Ingen props statisk komponent utan data
*/

export default Nav