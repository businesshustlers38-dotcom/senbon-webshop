/*
  catalog.js Butikens egna produkter och ritualer

  Det här är "databasen" just nu. Vill du lägga till en produkt:
  kopiera ett objekt i PRODUCTS, ge det ett nytt unikt id och ändra texterna.
  shape bestämmer vilken illustration som ritas (se ProductImage.jsx)
  Har du riktiga foton senare: lägg till image: '/bilder/namn.jpg' så används den istället.
*/

export const CATEGORIES = [
  { slug: 'body', label: 'Body' },
  { slug: 'face', label: 'Face' },
  { slug: 'fragrance', label: 'Fragrance' },
  { slug: 'home', label: 'Home' },
]

// Varje ritual har egna färger som används i illustrationer och bakgrunder
export const RITUALS = [
  {
    slug: 'morning-bloom',
    name: 'Morning Bloom',
    tagline: 'Cherry blossom & yuzu',
    mood: 'Awaken',
    story:
      'In Japan, the first sakura of spring is a reason to stop and look up. Morning Bloom captures that moment: bright yuzu, soft cherry blossom and a promise of a fresh start, every single morning.',
    colors: { body: '#e8c3bd', cap: '#b4935a', bg: '#f4e6e1', ink: '#6b4740' },
  },
  {
    slug: 'yozakura-night',
    name: 'Yozakura Night',
    tagline: 'White tea & sandalwood',
    mood: 'Unwind',
    story:
      'Yozakura means cherry blossoms at night, lit by lanterns under a dark sky. This ritual is made for the end of the day, when the house is quiet and it is finally time for yourself.',
    colors: { body: '#4a4560', cap: '#c9b37e', bg: '#e6e3ec', ink: '#f3efe6' },
  },
  {
    slug: 'hinoki-forest',
    name: 'Hinoki Forest',
    tagline: 'Japanese cypress & moss',
    mood: 'Ground',
    story:
      'Shinrin-yoku, forest bathing, is the simple act of being among trees. Hinoki Forest brings the woody calm of Japanese cypress into your shower and your home.',
    colors: { body: '#7d8f80', cap: '#3f3a33', bg: '#e3e8e1', ink: '#f3efe6' },
  },
  {
    slug: 'rice-ritual',
    name: 'Rice Ritual',
    tagline: 'Rice milk & cherry blossom',
    mood: 'Soften',
    story:
      'For centuries rice water has been part of Japanese beauty routines. Rice Ritual is gentle care for face and body, creamy, soft and perfect for every day.',
    colors: { body: '#d9c6ad', cap: '#a8786c', bg: '#f2eadf', ink: '#6b5545' },
  },
]

export const PRODUCTS = [
  // ===== Morning Bloom =====
  {
    id: 'sakura-shower-foam', name: 'Sakura Shower Foam', ritual: 'morning-bloom', category: 'body',
    size: '200 ml', price: 129, shape: 'pump', badge: 'Bestseller',
    description: 'A foaming shower gel that turns into a soft cloud of cherry blossom and yuzu. Wakes up your senses without drying out your skin.',
    notes: ['Cherry blossom', 'Yuzu', 'Rice milk'],
    howTo: 'Shake, press the pump and massage onto wet skin. Rinse and breathe in.',
  },
  {
    id: 'sakura-body-cream', name: 'Sakura Body Cream', ritual: 'morning-bloom', category: 'body',
    size: '220 ml', price: 249, shape: 'jar', badge: 'Bestseller',
    description: 'A rich but fast-absorbing body cream that leaves the skin soft with a light trail of sakura all day.',
    notes: ['Cherry blossom', 'Yuzu', 'Shea butter'],
    howTo: 'Warm a little cream between your hands and massage into clean skin.',
  },
  {
    id: 'sakura-hand-wash', name: 'Sakura Hand Wash', ritual: 'morning-bloom', category: 'body',
    size: '300 ml', price: 159, shape: 'pump',
    description: 'A gentle hand wash that makes washing your hands a small moment of spring.',
    notes: ['Cherry blossom', 'Yuzu'],
    howTo: 'Lather between wet hands and rinse.',
  },
  {
    id: 'morning-bloom-edp', name: 'Morning Bloom Eau de Parfum', ritual: 'morning-bloom', category: 'fragrance',
    size: '50 ml', price: 595, shape: 'perfume', badge: 'New',
    description: 'A luminous floral fragrance. Sparkling yuzu opens to a heart of cherry blossom on a soft musk base.',
    notes: ['Yuzu', 'Cherry blossom', 'White musk'],
    howTo: 'Spray on pulse points: wrists, neck and behind the ears.',
  },
  {
    id: 'sakura-fragrance-sticks', name: 'Sakura Fragrance Sticks', ritual: 'morning-bloom', category: 'home',
    size: '100 ml', price: 345, shape: 'diffuser',
    description: 'Rattan sticks that slowly fill a room with the fresh scent of blossoming trees for up to eight weeks.',
    notes: ['Cherry blossom', 'Green tea'],
    howTo: 'Place the sticks in the bottle. Turn them once a week for a stronger scent.',
  },

  // ===== Yozakura Night =====
  {
    id: 'night-bloom-bath-oil', name: 'Night Bloom Bath Oil', ritual: 'yozakura-night', category: 'body',
    size: '100 ml', price: 219, shape: 'bottle',
    description: 'A silky bath oil that disperses into warm water and wraps you in white tea and sandalwood.',
    notes: ['White tea', 'Sandalwood', 'Night-blooming jasmine'],
    howTo: 'Add a capful to running bath water. Relax for at least 15 minutes.',
  },
  {
    id: 'yozakura-pillow-mist', name: 'Yozakura Pillow Mist', ritual: 'yozakura-night', category: 'home',
    size: '50 ml', price: 179, shape: 'mist', badge: 'Bestseller',
    description: 'A calming mist for pillows and linen. The last step before sleep.',
    notes: ['White tea', 'Lavender', 'Sandalwood'],
    howTo: 'Spray two or three times over your pillow from 30 cm away.',
  },
  {
    id: 'yozakura-candle', name: 'Yozakura Scented Candle', ritual: 'yozakura-night', category: 'home',
    size: '290 g', price: 299, shape: 'candle',
    description: 'A plant wax candle with a soft, warm glow and around 50 hours of burn time.',
    notes: ['White tea', 'Sandalwood', 'Amber'],
    howTo: 'Let the wax melt to the edges the first time you light it. Never leave a burning candle unattended.',
  },
  {
    id: 'sleep-body-balm', name: 'Sleep Body Balm', ritual: 'yozakura-night', category: 'body',
    size: '100 ml', price: 229, shape: 'jar',
    description: 'A melting balm for dry areas like elbows, knees and feet. Made for slow evening massages.',
    notes: ['Sandalwood', 'White tea', 'Rice bran oil'],
    howTo: 'Massage into skin before bed, focusing on dry areas.',
  },
  {
    id: 'yozakura-edp', name: 'Yozakura Eau de Parfum', ritual: 'yozakura-night', category: 'fragrance',
    size: '50 ml', price: 595,
    shape: 'perfume',
    description: 'A deep, velvety evening fragrance. Night jasmine and white tea over warm sandalwood and amber.',
    notes: ['Night jasmine', 'White tea', 'Amber'],
    howTo: 'Spray on pulse points in the evening.',
  },

  // ===== Hinoki Forest =====
  {
    id: 'hinoki-shower-oil', name: 'Hinoki Shower Oil', ritual: 'hinoki-forest', category: 'body',
    size: '200 ml', price: 169, shape: 'pump',
    description: 'A shower oil that turns into a light milk on contact with water. Woody, fresh and grounding.',
    notes: ['Hinoki', 'Cedar', 'Moss'],
    howTo: 'Massage onto wet skin and rinse.',
  },
  {
    id: 'hinoki-bar-soap', name: 'Hinoki Bar Soap', ritual: 'hinoki-forest', category: 'body',
    size: '120 g', price: 89, shape: 'soap',
    description: 'A plastic-free bar soap with the scent of a Japanese forest after the rain.',
    notes: ['Hinoki', 'Rain', 'Moss'],
    howTo: 'Lather with warm water. Let it dry between uses to make it last longer.',
  },
  {
    id: 'hinoki-candle', name: 'Hinoki Scented Candle', ritual: 'hinoki-forest', category: 'home',
    size: '290 g', price: 299, shape: 'candle', badge: 'Bestseller',
    description: 'Woody and calm. Turns any room into a quiet forest.',
    notes: ['Hinoki', 'Cedar', 'Smoke'],
    howTo: 'Trim the wick to 5 mm before each use.',
  },
  {
    id: 'hinoki-room-spray', name: 'Hinoki Room Spray', ritual: 'hinoki-forest', category: 'home',
    size: '250 ml', price: 199, shape: 'mist',
    description: 'An instant breath of forest air for your home, car or wardrobe.',
    notes: ['Hinoki', 'Pine', 'Mint'],
    howTo: 'Spray into the air, away from furniture and fabrics.',
  },
  {
    id: 'hinoki-edp', name: 'Hinoki Eau de Parfum', ritual: 'hinoki-forest', category: 'fragrance',
    size: '50 ml', price: 595, shape: 'perfume', badge: 'New',
    description: 'A fresh woody fragrance for everyone. Green cypress, mossy earth and a hint of smoke.',
    notes: ['Hinoki', 'Vetiver', 'Incense'],
    howTo: 'Spray on pulse points.',
  },

  // ===== Rice Ritual =====
  {
    id: 'rice-milk-cleanser', name: 'Rice Milk Face Cleanser', ritual: 'rice-ritual', category: 'face',
    size: '150 ml', price: 239, shape: 'tube',
    description: 'A creamy cleanser that removes makeup and daily dirt while keeping the skin soft.',
    notes: ['Rice milk', 'Cherry blossom'],
    howTo: 'Massage onto damp skin morning and evening. Rinse with lukewarm water.',
  },
  {
    id: 'rice-water-toner', name: 'Rice Water Toner', ritual: 'rice-ritual', category: 'face',
    size: '150 ml', price: 269, shape: 'bottle',
    description: 'A refreshing toner that prepares the skin for your moisturiser.',
    notes: ['Rice water', 'Green tea'],
    howTo: 'Pat onto clean skin with your hands or a cotton pad.',
  },
  {
    id: 'rice-cream-moisturiser', name: 'Rice Cream Moisturiser', ritual: 'rice-ritual', category: 'face',
    size: '50 ml', price: 395, shape: 'jar', badge: 'Bestseller',
    description: 'A soft day and night cream that leaves the skin smooth and comfortable.',
    notes: ['Rice milk', 'Cherry blossom', 'Squalane'],
    howTo: 'Apply to face and neck after toner.',
  },
  {
    id: 'rice-body-scrub', name: 'Rice Body Scrub', ritual: 'rice-ritual', category: 'body',
    size: '300 g', price: 229, shape: 'jar',
    description: 'A sugar scrub with fine rice powder that buffs away dry skin.',
    notes: ['Rice powder', 'Sweet almond', 'Cherry blossom'],
    howTo: 'Massage onto wet skin in circular motions once or twice a week. Rinse.',
  },
  {
    id: 'rice-hand-cream', name: 'Rice Milk Hand Cream', ritual: 'rice-ritual', category: 'body',
    size: '75 ml', price: 119, shape: 'tube',
    description: 'A non-greasy hand cream that fits in every bag.',
    notes: ['Rice milk', 'Shea butter'],
    howTo: 'Massage into hands whenever they feel dry.',
  },
]

export function getRitual(slug) {
  return RITUALS.find(r => r.slug === slug)
}

export function categoryLabel(slug) {
  return CATEGORIES.find(c => c.slug === slug)?.label ?? slug
}
