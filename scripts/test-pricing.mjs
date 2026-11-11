// Testar serverns prisberäkning. Kör: npm run test:pricing
import assert from 'node:assert/strict'
import { computeOrder, toOre } from '../supabase/functions/_shared/pricing.js'

const products = [
  { id: 'a', name: 'A', price: 129, active: true },
  { id: 'b', name: 'B', price: 395, active: true },
  { id: 'old', name: 'Old', price: 10, active: false },
]
let passed = 0
function test(name, fn) { fn(); passed++; console.log('✓', name) }

test('räknar delsumma och frakt under 499 kr', () => {
  const o = computeOrder([{ id: 'a', qty: 2 }], products)
  assert.equal(o.subtotal, 258); assert.equal(o.shipping, 49); assert.equal(o.total, 307)
})
test('fri frakt från 499 kr', () => {
  const o = computeOrder([{ id: 'a', qty: 1 }, { id: 'b', qty: 1 }], products)
  assert.equal(o.subtotal, 524); assert.equal(o.shipping, 0)
})
test('ignorerar pris som skickas från webbläsaren', () => {
  const o = computeOrder([{ id: 'b', qty: 1, price: 1 }], products)
  assert.equal(o.lines[0].price, 395)
})
test('stoppar okänd produkt', () => assert.throws(() => computeOrder([{ id: 'hack', qty: 1 }], products)))
test('stoppar inaktiv produkt', () => assert.throws(() => computeOrder([{ id: 'old', qty: 1 }], products)))
test('stoppar negativt antal', () => assert.throws(() => computeOrder([{ id: 'a', qty: -3 }], products)))
test('stoppar decimalantal', () => assert.throws(() => computeOrder([{ id: 'a', qty: 1.5 }], products)))
test('stoppar för stort antal', () => assert.throws(() => computeOrder([{ id: 'a', qty: 999 }], products)))
test('stoppar dubbletter', () => assert.throws(() => computeOrder([{ id: 'a', qty: 1 }, { id: 'a', qty: 1 }], products)))
test('stoppar tom kasse', () => assert.throws(() => computeOrder([], products)))
test('kronor till öre', () => { assert.equal(toOre(249), 24900); assert.equal(toOre(0.1 + 0.2), 30) })

console.log(`\n${passed} tester godkända`)
