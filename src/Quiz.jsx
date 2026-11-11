import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PRODUCTS, RITUALS, getRitual } from './data/catalog'
import ProductCard from './ProductCard'

/*
  Quiz.jsx "Hitta din ritual"

  Hur det fungerar:
  Varje svar ger en poäng till en ritual (svarets "ritual").
  Efter sista frågan vinner ritualen med flest poäng.
  Allt styrs av QUESTIONS-arrayen, så du kan lägga till frågor utan att röra logiken.
*/

const QUESTIONS = [
  {
    question: 'När behöver du mest en stund för dig själv?',
    answers: [
      { text: 'På morgonen, innan dagen drar igång', ritual: 'morning-bloom' },
      { text: 'På kvällen, när allt äntligen är tyst', ritual: 'yozakura-night' },
      { text: 'Mitt på dagen, när allt känns stressigt', ritual: 'hinoki-forest' },
      { text: 'Lite varje dag, som en enkel vana', ritual: 'rice-ritual' },
    ],
  },
  {
    question: 'Vilken doft lockar dig mest?',
    answers: [
      { text: 'Blommig och frisk', ritual: 'morning-bloom' },
      { text: 'Varm och mjuk', ritual: 'yozakura-night' },
      { text: 'Träig och grön', ritual: 'hinoki-forest' },
      { text: 'Ren och krämig', ritual: 'rice-ritual' },
    ],
  },
  {
    question: 'Vad vill du känna mer av?',
    answers: [
      { text: 'Energi', ritual: 'morning-bloom' },
      { text: 'Lugn', ritual: 'yozakura-night' },
      { text: 'Närvaro', ritual: 'hinoki-forest' },
      { text: 'Omsorg', ritual: 'rice-ritual' },
    ],
  },
]

// Räknar poäng och returnerar vinnande ritual
// Vid lika poäng vinner den som valdes först (svar[0])
function pickRitual(answers) {
  const scores = {}
  answers.forEach(slug => { scores[slug] = (scores[slug] ?? 0) + 1 })
  return answers.reduce((best, slug) => (scores[slug] > scores[best] ? slug : best), answers[0])
}

function Quiz() {
  // answers är en array med ritual-slugs, en per besvarad fråga
  const [answers, setAnswers] = useState([])
  const step = answers.length
  const done = step === QUESTIONS.length

  if (done) {
    const ritual = getRitual(pickRitual(answers))
    const products = PRODUCTS.filter(p => p.ritual === ritual.slug && p.category !== 'gift').slice(0, 4)
    const giftSet = PRODUCTS.find(p => p.ritual === ritual.slug && p.category === 'gift')

    return (
      <section className="quiz wrap">
        <div
          className={`quiz-result ${ritual.colors.ink === '#f3efe6' ? 'is-dark' : ''}`}
          style={{ '--hero-bg': ritual.colors.body }}
        >
          <p className="eyebrow">Din ritual är</p>
          <h1 className="hero-title">{ritual.name}</h1>
          <p className="hero-text">{ritual.story}</p>
          <div className="hero-ctas">
            <Link to={`/ritualer/${ritual.slug}`} className="btn btn-light">Se hela ritualen</Link>
            <button className="btn btn-ghost-dark" onClick={() => setAnswers([])}>Gör om quizet</button>
          </div>
        </div>

        <h2 className="section-title quiz-subtitle">Börja här</h2>
        <div className="grid">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>

        {giftSet && (
          <p className="quiz-gift">
            Vill du ha allt på en gång? <Link to={`/produkt/${giftSet.id}`}>{giftSet.name} →</Link>
          </p>
        )}
      </section>
    )
  }

  const current = QUESTIONS[step]

  return (
    <section className="quiz wrap">
      <p className="eyebrow">Hitta din ritual · Fråga {step + 1} av {QUESTIONS.length}</p>
      {/* Förloppsindikator */}
      <div className="bar quiz-bar" role="progressbar" aria-valuenow={step} aria-valuemin="0" aria-valuemax={QUESTIONS.length}>
        <span style={{ width: `${(step / QUESTIONS.length) * 100}%` }} />
      </div>

      <h1 className="quiz-question">{current.question}</h1>

      <div className="quiz-answers">
        {current.answers.map(a => (
          <button
            key={a.text}
            className="quiz-answer"
            style={{ '--answer-color': RITUALS.find(r => r.slug === a.ritual).colors.body }}
            onClick={() => setAnswers([...answers, a.ritual])}
          >
            {a.text}
          </button>
        ))}
      </div>

      {step > 0 && (
        <button className="link-btn" onClick={() => setAnswers(answers.slice(0, -1))}>← Föregående fråga</button>
      )}
    </section>
  )
}

export default Quiz
