const PROMISES = [
  { title: 'Free shipping', text: 'On all orders over $50' },
  { title: '30-day returns', text: 'Changed your mind? No problem' },
  { title: 'Gift wrapping', text: 'Every order, wrapped with care' },
]

function Footer() {
  return (
    <footer className="footer">
      {/* Löften till kunden, loopas från en array så de är lätta att ändra */}
      <ul className="promises">
        {PROMISES.map(p => (
          <li key={p.title}>
            <strong>{p.title}</strong>
            <span>{p.text}</span>
          </li>
        ))}
      </ul>
      <div className="footer-bottom">
        <span className="brand-name">Senbon Zakura</span>
        <span>© {new Date().getFullYear()} · Demo shop</span>
      </div>
    </footer>
  )
}

export default Footer
