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

export default Nav