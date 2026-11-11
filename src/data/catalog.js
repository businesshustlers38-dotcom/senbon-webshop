/*
  catalog.js Butikens egna produkter, ritualer och presentset

  Det här är "databasen" just nu. Vill du lägga till en produkt:
  kopiera ett objekt i PRODUCTS, ge det ett nytt unikt id och ändra texterna.
  shape bestämmer vilken illustration som ritas (se ProductImage.jsx)
  Riktigt foto: lägg bilden i public/products/ och skriv image: '/products/namn.jpg'
*/

export const CATEGORIES = [
  { slug: 'body', label: 'Kropp' },
  { slug: 'face', label: 'Ansikte' },
  { slug: 'fragrance', label: 'Doft' },
  { slug: 'home', label: 'Hem' },
  { slug: 'gift', label: 'Presentset' },
]

// Varje ritual har egna färger som används i illustrationer och bakgrunder
export const RITUALS = [
  {
    slug: 'morning-bloom',
    name: 'Morning Bloom',
    tagline: 'Körsbärsblom & yuzu',
    mood: 'Vakna',
    story:
      'I Japan är vårens första sakura en anledning att stanna upp och titta upp. Morning Bloom fångar det ögonblicket: frisk yuzu, mjuk körsbärsblom och ett löfte om en ny start, varje morgon.',
    colors: { body: '#e8c3bd', cap: '#b4935a', bg: '#f4e6e1', ink: '#6b4740' },
  },
  {
    slug: 'yozakura-night',
    name: 'Yozakura Night',
    tagline: 'Vitt te & sandelträ',
    mood: 'Varva ner',
    story:
      'Yozakura betyder körsbärsblommor på natten, upplysta av lyktor under en mörk himmel. Den här ritualen är gjord för slutet av dagen, när huset är tyst och det äntligen är tid för dig själv.',
    colors: { body: '#4a4560', cap: '#c9b37e', bg: '#e6e3ec', ink: '#f3efe6' },
  },
  {
    slug: 'hinoki-forest',
    name: 'Hinoki Forest',
    tagline: 'Japansk cypress & mossa',
    mood: 'Landa',
    story:
      'Shinrin-yoku, skogsbad, är den enkla handlingen att vara bland träd. Hinoki Forest tar med det träiga lugnet från japansk cypress in i din dusch och ditt hem.',
    colors: { body: '#7d8f80', cap: '#3f3a33', bg: '#e3e8e1', ink: '#f3efe6' },
  },
  {
    slug: 'rice-ritual',
    name: 'Rice Ritual',
    tagline: 'Rismjölk & körsbärsblom',
    mood: 'Mjuka upp',
    story:
      'I århundraden har risvatten varit en del av japanska skönhetsrutiner. Rice Ritual är mild omsorg för ansikte och kropp, krämig, mjuk och perfekt för varje dag.',
    colors: { body: '#d9c6ad', cap: '#a8786c', bg: '#f2eadf', ink: '#6b5545' },
  },
]

export const PRODUCTS = [
  // ===== Morning Bloom =====
  {
    id: 'sakura-shower-foam', name: 'Sakura Duschskum', ritual: 'morning-bloom', category: 'body',
    size: '200 ml', price: 129, shape: 'pump', badge: 'Bästsäljare',
    description: 'Ett skummande duschgel som förvandlas till ett mjukt moln av körsbärsblom och yuzu. Väcker sinnena utan att torka ut huden.',
    notes: ['Körsbärsblom', 'Yuzu', 'Rismjölk'],
    howTo: 'Skaka, tryck på pumpen och massera in på våt hud. Skölj och andas in.',
  },
  {
    id: 'sakura-body-cream', name: 'Sakura Kroppskräm', ritual: 'morning-bloom', category: 'body',
    size: '220 ml', price: 249, shape: 'jar', badge: 'Bästsäljare',
    description: 'En rik men snabbt absorberande kroppskräm som lämnar huden mjuk med ett lätt spår av sakura hela dagen.',
    notes: ['Körsbärsblom', 'Yuzu', 'Sheasmör'],
    howTo: 'Värm lite kräm mellan händerna och massera in på ren hud.',
  },
  {
    id: 'sakura-hand-wash', name: 'Sakura Handtvål', ritual: 'morning-bloom', category: 'body',
    size: '300 ml', price: 159, shape: 'pump',
    description: 'En mild handtvål som gör varje handtvätt till en liten stund av vår.',
    notes: ['Körsbärsblom', 'Yuzu'],
    howTo: 'Löddra mellan våta händer och skölj.',
  },
  {
    id: 'morning-bloom-edp', name: 'Morning Bloom Eau de Parfum', ritual: 'morning-bloom', category: 'fragrance',
    size: '50 ml', price: 595, shape: 'perfume', badge: 'Nyhet',
    description: 'En strålande blommig doft. Sprudlande yuzu öppnar mot ett hjärta av körsbärsblom på en mjuk mysk-bas.',
    notes: ['Yuzu', 'Körsbärsblom', 'Vit mysk'],
    howTo: 'Spraya på pulspunkter: handleder, hals och bakom öronen.',
  },
  {
    id: 'sakura-fragrance-sticks', name: 'Sakura Doftpinnar', ritual: 'morning-bloom', category: 'home',
    size: '100 ml', price: 345, shape: 'diffuser',
    description: 'Rottingpinnar som sakta fyller rummet med den friska doften av blommande träd i upp till åtta veckor.',
    notes: ['Körsbärsblom', 'Grönt te'],
    howTo: 'Sätt pinnarna i flaskan. Vänd dem en gång i veckan för starkare doft.',
  },

  // ===== Yozakura Night =====
  {
    id: 'night-bloom-bath-oil', name: 'Night Bloom Badolja', ritual: 'yozakura-night', category: 'body',
    size: '100 ml', price: 219, shape: 'bottle',
    description: 'En silkeslen badolja som sprider sig i varmt vatten och sveper in dig i vitt te och sandelträ.',
    notes: ['Vitt te', 'Sandelträ', 'Nattjasmin'],
    howTo: 'Häll en kork i det rinnande badvattnet. Koppla av i minst 15 minuter.',
  },
  {
    id: 'yozakura-pillow-mist', name: 'Yozakura Kuddspray', ritual: 'yozakura-night', category: 'home',
    size: '50 ml', price: 179, shape: 'mist', badge: 'Bästsäljare',
    description: 'En lugnande spray för kuddar och sängkläder. Det sista steget innan sömnen.',
    notes: ['Vitt te', 'Lavendel', 'Sandelträ'],
    howTo: 'Spraya två eller tre gånger över kudden från 30 cm avstånd.',
  },
  {
    id: 'yozakura-candle', name: 'Yozakura Doftljus', ritual: 'yozakura-night', category: 'home',
    size: '290 g', price: 299, shape: 'candle',
    description: 'Ett ljus av växtbaserat vax med ett mjukt, varmt sken och cirka 50 timmars brinntid.',
    notes: ['Vitt te', 'Sandelträ', 'Bärnsten'],
    howTo: 'Låt vaxet smälta ända ut till kanterna första gången. Lämna aldrig ett tänt ljus utan tillsyn.',
  },
  {
    id: 'sleep-body-balm', name: 'Sömn Kroppsbalsam', ritual: 'yozakura-night', category: 'body',
    size: '100 ml', price: 229, shape: 'jar',
    description: 'Ett smältande balsam för torra partier som armbågar, knän och fötter. Gjort för långsam kvällsmassage.',
    notes: ['Sandelträ', 'Vitt te', 'Riskliolja'],
    howTo: 'Massera in före sänggåendet, extra på torra partier.',
  },
  {
    id: 'yozakura-edp', name: 'Yozakura Eau de Parfum', ritual: 'yozakura-night', category: 'fragrance',
    size: '50 ml', price: 595, shape: 'perfume',
    description: 'En djup, sammetslen kvällsdoft. Nattjasmin och vitt te över varmt sandelträ och bärnsten.',
    notes: ['Nattjasmin', 'Vitt te', 'Bärnsten'],
    howTo: 'Spraya på pulspunkter på kvällen.',
  },

  // ===== Hinoki Forest =====
  {
    id: 'hinoki-shower-oil', name: 'Hinoki Duscholja', ritual: 'hinoki-forest', category: 'body',
    size: '200 ml', price: 169, shape: 'pump',
    description: 'En duscholja som blir till en lätt mjölk i kontakt med vatten. Träig, frisk och jordande.',
    notes: ['Hinoki', 'Ceder', 'Mossa'],
    howTo: 'Massera in på våt hud och skölj.',
  },
  {
    id: 'hinoki-bar-soap', name: 'Hinoki Tvålkaka', ritual: 'hinoki-forest', category: 'body',
    size: '120 g', price: 89, shape: 'soap',
    description: 'En plastfri tvålkaka med doften av en japansk skog efter regnet.',
    notes: ['Hinoki', 'Regn', 'Mossa'],
    howTo: 'Löddra med varmt vatten. Låt den torka mellan användningarna så räcker den längre.',
  },
  {
    id: 'hinoki-candle', name: 'Hinoki Doftljus', ritual: 'hinoki-forest', category: 'home',
    size: '290 g', price: 299, shape: 'candle', badge: 'Bästsäljare',
    description: 'Träigt och lugnt. Förvandlar vilket rum som helst till en stilla skog.',
    notes: ['Hinoki', 'Ceder', 'Rök'],
    howTo: 'Klipp veken till 5 mm före varje användning.',
  },
  {
    id: 'hinoki-room-spray', name: 'Hinoki Rumsspray', ritual: 'hinoki-forest', category: 'home',
    size: '250 ml', price: 199, shape: 'mist',
    description: 'Ett ögonblickligt andetag av skogsluft för hemmet, bilen eller garderoben.',
    notes: ['Hinoki', 'Tall', 'Mynta'],
    howTo: 'Spraya i luften, bort från möbler och textilier.',
  },
  {
    id: 'hinoki-edp', name: 'Hinoki Eau de Parfum', ritual: 'hinoki-forest', category: 'fragrance',
    size: '50 ml', price: 595, shape: 'perfume', badge: 'Nyhet',
    description: 'En frisk träig doft för alla. Grön cypress, mossig jord och en aning rök.',
    notes: ['Hinoki', 'Vetiver', 'Rökelse'],
    howTo: 'Spraya på pulspunkter.',
  },

  // ===== Rice Ritual =====
  {
    id: 'rice-milk-cleanser', name: 'Rismjölk Ansiktsrengöring', ritual: 'rice-ritual', category: 'face',
    size: '150 ml', price: 239, shape: 'tube',
    description: 'En krämig rengöring som tar bort smink och vardagens smuts och samtidigt håller huden mjuk.',
    notes: ['Rismjölk', 'Körsbärsblom'],
    howTo: 'Massera in på fuktig hud morgon och kväll. Skölj med ljummet vatten.',
  },
  {
    id: 'rice-water-toner', name: 'Risvatten Ansiktsvatten', ritual: 'rice-ritual', category: 'face',
    size: '150 ml', price: 269, shape: 'bottle',
    description: 'Ett uppfriskande ansiktsvatten som förbereder huden för din fuktkräm.',
    notes: ['Risvatten', 'Grönt te'],
    howTo: 'Klappa in på ren hud med händerna eller en bomullsrondell.',
  },
  {
    id: 'rice-cream-moisturiser', name: 'Riskräm Fuktkräm', ritual: 'rice-ritual', category: 'face',
    size: '50 ml', price: 395, shape: 'jar', badge: 'Bästsäljare',
    description: 'En mjuk dag- och nattkräm som lämnar huden len och bekväm.',
    notes: ['Rismjölk', 'Körsbärsblom', 'Skvalan'],
    howTo: 'Applicera på ansikte och hals efter ansiktsvattnet.',
  },
  {
    id: 'rice-body-scrub', name: 'Ris Kroppsskrubb', ritual: 'rice-ritual', category: 'body',
    size: '300 g', price: 229, shape: 'jar',
    description: 'En sockerskrubb med fint rispulver som tar bort torr hud.',
    notes: ['Rispulver', 'Sötmandel', 'Körsbärsblom'],
    howTo: 'Massera in på våt hud med cirkelrörelser en till två gånger i veckan. Skölj.',
  },
  {
    id: 'rice-hand-cream', name: 'Rismjölk Handkräm', ritual: 'rice-ritual', category: 'body',
    size: '75 ml', price: 119, shape: 'tube',
    description: 'En handkräm som inte kladdar och får plats i varje väska.',
    notes: ['Rismjölk', 'Sheasmör'],
    howTo: 'Massera in i händerna när de känns torra.',
  },

  // ===== Presentset =====
  // contents: id:n på produkterna i setet. Priset är lägre än summan = kunden sparar
  {
    id: 'gift-morning-bloom', name: 'Morning Bloom Presentset', ritual: 'morning-bloom', category: 'gift',
    size: '3 produkter', price: 449, shape: 'box', badge: 'Presenttips',
    contents: ['sakura-shower-foam', 'sakura-body-cream', 'sakura-hand-wash'],
    description: 'Allt för en lugn morgon, inslaget i en presentask med sakura-mönster.',
    notes: ['Körsbärsblom', 'Yuzu'],
    howTo: 'Ge bort, eller behåll själv. Vi lovar att inte berätta.',
  },
  {
    id: 'gift-yozakura-night', name: 'Yozakura Night Presentset', ritual: 'yozakura-night', category: 'gift',
    size: '3 produkter', price: 599, shape: 'box',
    contents: ['night-bloom-bath-oil', 'yozakura-pillow-mist', 'yozakura-candle'],
    description: 'Badolja, kuddspray och doftljus för den perfekta kvällsritualen.',
    notes: ['Vitt te', 'Sandelträ'],
    howTo: 'Tänd ljuset, fyll badet och spraya kudden innan sömnen.',
  },
  {
    id: 'gift-hinoki-forest', name: 'Hinoki Forest Presentset', ritual: 'hinoki-forest', category: 'gift',
    size: '3 produkter', price: 489, shape: 'box',
    contents: ['hinoki-shower-oil', 'hinoki-bar-soap', 'hinoki-candle'],
    description: 'Ta med skogen hem. Duscholja, tvålkaka och doftljus i en presentask.',
    notes: ['Hinoki', 'Ceder'],
    howTo: 'Perfekt till någon som behöver landa.',
  },
]

export function getRitual(slug) {
  return RITUALS.find(r => r.slug === slug)
}

export function getProduct(id) {
  return PRODUCTS.find(p => p.id === id)
}

export function categoryLabel(slug) {
  return CATEGORIES.find(c => c.slug === slug)?.label ?? slug
}

// Summan av produkterna i ett set, så vi kan visa "Spara X kr"
export function setValue(product) {
  if (!product.contents) return 0
  return product.contents.reduce((sum, id) => sum + (getProduct(id)?.price ?? 0), 0)
}
