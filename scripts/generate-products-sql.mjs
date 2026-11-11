/*
  Skapar supabase/products.sql från src/data/catalog.js

  catalog.js är "sanningen" för produkter. Servern behöver priserna i databasen,
  så istället för att skriva dem två gånger (och glömma att uppdatera en)
  genererar vi SQL:en. Kör efter varje prisändring:

    npm run db:products

  och kör sedan den nya products.sql i Supabase SQL Editor.
*/
import { writeFileSync } from 'node:fs'
import { PRODUCTS } from '../src/data/catalog.js'

// '' i SQL = ett citattecken inuti en text
const q = s => `'${String(s).replace(/'/g, "''")}'`

const rows = PRODUCTS.map(p => `  (${q(p.id)}, ${q(p.name)}, ${Number(p.price).toFixed(2)}, true)`).join(',\n')

const sql = `-- GENERERAD FIL, ändra inte för hand. Kör: npm run db:products
-- Lägger in eller uppdaterar alla produkter och priser.
insert into products (id, name, price, active) values
${rows}
on conflict (id) do update set name = excluded.name, price = excluded.price, active = excluded.active;

-- Produkter som tagits bort ur catalog.js går inte längre att köpa
update products set active = false where id not in (${PRODUCTS.map(p => q(p.id)).join(', ')});
`

writeFileSync(new URL('../supabase/products.sql', import.meta.url), sql)
console.log(`Skrev ${PRODUCTS.length} produkter till supabase/products.sql`)
