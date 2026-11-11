// Intl.NumberFormat formaterar pris korrekt: 9.9 blir "$9.90"
// Byt 'USD' till 'SEK' och 'en-US' till 'sv-SE' om du byter valuta senare
const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export function formatPrice(amount) {
  return formatter.format(amount)
}
