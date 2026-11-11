import { getRitual } from './data/catalog'

/*
  ProductImage.jsx Ritar en produktillustration med SVG

  Varför SVG: skarpt i alla storlekar, nästan ingen filstorlek, och färgerna
  kommer från ritualen så allt matchar automatiskt.
  Har produkten ett riktigt foto (image) visas det istället.
*/

// Liten etikett med varumärket, återanvänds på varje form
function Label({ text = 'SENBON', y, w = 50, ink }) {
  return (
    <g>
      <rect x={100 - w / 2} y={y} width={w} height="22" fill="#fffdf9" opacity="0.85" />
      <text x="100" y={y + 14} textAnchor="middle" fontSize="6.5" letterSpacing="1.6" fill={ink === '#f3efe6' ? '#2a2522' : ink} fontFamily="Jost, sans-serif">
        {text}
      </text>
    </g>
  )
}

// Varje form är en funktion som tar ritualens färger och returnerar SVG
const SHAPES = {
  pump: c => (
    <>
      <rect x="82" y="52" width="36" height="12" rx="3" fill={c.cap} />
      <rect x="112" y="55" width="30" height="6" rx="2" fill={c.cap} />
      <rect x="92" y="64" width="16" height="24" fill={c.cap} />
      <rect x="64" y="86" width="72" height="132" rx="12" fill={c.body} />
      <Label y={140} ink={c.ink} />
    </>
  ),
  jar: c => (
    <>
      <rect x="44" y="128" width="112" height="90" rx="16" fill={c.body} />
      <rect x="40" y="104" width="120" height="30" rx="6" fill={c.cap} />
      <Label y={160} w={60} ink={c.ink} />
    </>
  ),
  candle: c => (
    <>
      <ellipse cx="100" cy="84" rx="5" ry="11" fill="#e9c46a" opacity="0.9" />
      <line x1="100" y1="94" x2="100" y2="108" stroke="#3f3a33" strokeWidth="2" />
      <rect x="52" y="104" width="96" height="114" rx="10" fill={c.body} opacity="0.35" />
      <rect x="56" y="112" width="88" height="102" rx="8" fill={c.body} />
      <Label y={150} w={56} ink={c.ink} />
    </>
  ),
  tube: c => (
    <>
      <rect x="68" y="52" width="64" height="10" fill={c.body} />
      <path d="M70 62 H130 L122 186 H78 Z" fill={c.body} />
      <rect x="78" y="186" width="44" height="32" rx="4" fill={c.cap} />
      <Label y={110} w={40} ink={c.ink} />
    </>
  ),
  perfume: c => (
    <>
      <rect x="78" y="56" width="44" height="44" rx="4" fill={c.cap} />
      <rect x="90" y="98" width="20" height="10" fill={c.cap} opacity="0.7" />
      <rect x="54" y="106" width="92" height="112" rx="6" fill={c.body} opacity="0.55" />
      <rect x="62" y="114" width="76" height="96" rx="4" fill={c.body} />
      <Label y={150} w={52} ink={c.ink} />
    </>
  ),
  diffuser: c => (
    <>
      {[[70, 28], [92, 20], [114, 26], [134, 40]].map(([x, y]) => (
        <line key={x} x1="100" y1="118" x2={x} y2={y} stroke="#8a6f52" strokeWidth="2.5" strokeLinecap="round" />
      ))}
      <rect x="88" y="110" width="24" height="22" fill={c.cap} />
      <rect x="58" y="130" width="84" height="88" rx="20" fill={c.body} />
      <Label y={164} w={50} ink={c.ink} />
    </>
  ),
  mist: c => (
    <>
      <rect x="86" y="62" width="28" height="22" rx="4" fill={c.cap} />
      <rect x="110" y="68" width="10" height="5" fill={c.cap} />
      <rect x="92" y="84" width="16" height="12" fill={c.cap} opacity="0.8" />
      <rect x="68" y="94" width="64" height="124" rx="14" fill={c.body} />
      <Label y={146} w={44} ink={c.ink} />
    </>
  ),
  bottle: c => (
    <>
      <rect x="84" y="54" width="32" height="34" rx="4" fill={c.cap} />
      <path d="M86 88 H114 L132 108 V210 a8 8 0 0 1 -8 8 H76 a8 8 0 0 1 -8 -8 V108 Z" fill={c.body} />
      <Label y={146} w={50} ink={c.ink} />
    </>
  ),
  box: c => (
    <>
      {/* Presentask med lock och sidenband */}
      <rect x="40" y="120" width="120" height="96" rx="3" fill={c.body} />
      <rect x="34" y="104" width="132" height="24" rx="3" fill={c.body} />
      <rect x="34" y="104" width="132" height="24" rx="3" fill="#000" opacity="0.06" />
      <rect x="94" y="104" width="12" height="112" fill={c.cap} />
      <path d="M100 104 C80 80 66 92 78 104 Z M100 104 C120 80 134 92 122 104 Z" fill={c.cap} />
      <Label text="SENBON ZAKURA" y={160} w={88} ink={c.ink} />
    </>
  ),
  soap: c => (
    <>
      <rect x="38" y="150" width="124" height="64" rx="28" fill={c.body} />
      <ellipse cx="100" cy="176" rx="34" ry="12" fill="none" stroke="#fffdf9" strokeOpacity="0.6" strokeWidth="2" />
      <text x="100" y="180" textAnchor="middle" fontSize="8" letterSpacing="2" fill="#fffdf9" fillOpacity="0.8" fontFamily="Jost, sans-serif">SZ</text>
    </>
  ),
}

function ProductImage({ product, className = '' }) {
  if (product.image) {
    return <img className={className} src={product.image} alt={product.name} />
  }

  const { colors } = getRitual(product.ritual)
  const draw = SHAPES[product.shape] ?? SHAPES.bottle

  return (
    <svg className={className} viewBox="0 0 200 240" role="img" aria-label={product.name}>
      {/* Mjuk skugga under produkten */}
      <ellipse cx="100" cy="222" rx="62" ry="6" fill="#2a2522" opacity="0.08" />
      {draw(colors)}
    </svg>
  )
}

export default ProductImage
