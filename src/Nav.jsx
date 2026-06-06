import { Link } from "react-router-dom";

function Nav() {
  
   // Jag använder min gamla CSS-klasser från den gamla Senbonzakura projekt
  return (
    <header className="Huvudsidan">
     <nav className="Meny">

       {/* Logo från public mappen */}
      <img src="/Senbonlogo.jpg" alt="Senbon Zakura logo" height={50} />
      
      <ul className="Meny">
        
 {/* Link från React Router navigerar utan att ladda om sidan */}
        <li><Link className="nav-länk" to="/">Hem</Link></li>
          <li><Link className="nav-länk" to="/">Ordern</Link></li>

      </ul>

     </nav>
    </header>
  )
}

export default Nav