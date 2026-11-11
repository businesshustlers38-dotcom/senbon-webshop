import { Link } from 'react-router-dom'

// Värderingar som loopas, lätt att ändra eller lägga till fler
const VALUES = [
  { title: 'Långsamhet', text: 'Vi tror att några minuter av omsorg om dagen gör mer än en spadag om året.' },
  { title: 'Enkelhet', text: 'Få produkter som gör sitt jobb väl, i stället för hyllor fulla av löften.' },
  { title: 'Omtanke', text: 'Vi väljer förpackningar som går att återvinna och fyller på där det går.' },
]

function OmOss() {
  return (
    <>
      <header className="about-hero">
        <div className="wrap">
          <p className="eyebrow">Om Senbon Zakura</p>
          <h1 className="hero-title">Tusen körsbärsblommor,<br />en stund i taget</h1>
        </div>
      </header>

      <section className="wrap about-body">
        <div className="about-text">
          <p className="lead">
            Senbon Zakura föddes ur en enkel tanke: vardagen är full av små ögonblick som vi rusar förbi.
            Morgonduschen. Att tvätta händerna. Att tända ett ljus när det mörknar.
          </p>
          <p>
            I Japan samlas man varje vår under blommande körsbärsträd för att fira något som bara varar
            några dagar. Det kallas hanami. Vi tar med den känslan in i vardagen, med produkter som
            gör att du stannar upp och märker stunden, i stället för att bara ta dig igenom den.
          </p>
          <p>
            Varje ritual är byggd runt ett ögonblick på dagen och en doft som passar det. Börja med en
            produkt, eller bygg hela rutinen. Det viktiga är inte hur mycket du använder, utan att du är där när du gör det.
          </p>
        </div>

        <ul className="values">
          {VALUES.map((v, i) => (
            <li key={v.title}>
              <span className="step-num">{String(i + 1).padStart(2, '0')}</span>
              <strong>{v.title}</strong>
              <p className="muted">{v.text}</p>
            </li>
          ))}
        </ul>

        <div className="about-cta">
          <p className="section-title">Vet du inte var du ska börja?</p>
          <Link to="/hitta-din-ritual" className="btn btn-dark">Gör ritual-quizet</Link>
        </div>
      </section>
    </>
  )
}

export default OmOss
