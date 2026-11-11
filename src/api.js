const BASE_URL = 'https://dummyjson.com'

// Bara kategorier som passar en butik för vardagsprodukter
export const CATEGORIES = [
  { slug: 'skin-care', label: 'Skin Care' },
  { slug: 'beauty', label: 'Beauty' },
  { slug: 'fragrances', label: 'Fragrances' },
  { slug: 'home-decoration', label: 'Home' },
]

export function categoryLabel(slug) {
  return CATEGORIES.find(c => c.slug === slug)?.label ?? slug
}

// En gemensam hjälpfunktion så att ALLA anrop kollar res.ok
// fetch kastar inget fel vid 404/500, så vi måste göra det själva
async function getJSON(url, signal) {
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`HTTP Error: ${res.status}`)
  return res.json()
}

// Hämtar alla kategorier samtidigt med Promise.all istället för en i taget
// limit=0 betyder "alla produkter" (standard är bara 30)
export async function fetchProducts(signal) {
  const results = await Promise.all(
    CATEGORIES.map(c =>
      getJSON(`${BASE_URL}/products/category/${c.slug}?limit=0`, signal)
    )
  )
  return results.flatMap(r => r.products)
}

export function fetchProduct(id, signal) {
  return getJSON(`${BASE_URL}/products/${id}`, signal)
}

/*
  api.js Allt som pratar med DummyJSON finns här

  Varför en egen fil: om vi byter till ett riktigt API eller egen backend
  behöver vi bara ändra den här filen, inte varje komponent
  signal kommer från AbortController och avbryter anrop när användaren lämnar sidan
*/
