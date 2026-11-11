// Intl.NumberFormat formaterar pris enligt svensk standard: 249 blir "249 kr"
const formatter = new Intl.NumberFormat('sv-SE', {
  style: 'currency',
  currency: 'SEK',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

export function formatPrice(amount) {
  return formatter.format(amount)
}

// Fraktreglerna finns på ETT ställe: samma fil som servern räknar med.
// Ändrar du gränsen där ändras både webbsidan och betalningen.
export { FREE_SHIPPING_FROM, SHIPPING_COST } from '../supabase/functions/_shared/pricing.js'
