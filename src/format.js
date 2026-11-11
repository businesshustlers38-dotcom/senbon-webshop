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

// Frakt bor här så Cart och Ordersida använder exakt samma regler
export const FREE_SHIPPING_FROM = 499
export const SHIPPING_COST = 49
