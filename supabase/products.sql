-- GENERERAD FIL, ändra inte för hand. Kör: npm run db:products
-- Lägger in eller uppdaterar alla produkter och priser.
insert into products (id, name, price, active) values
  ('sakura-shower-foam', 'Sakura Duschskum', 129.00, true),
  ('sakura-body-cream', 'Sakura Kroppskräm', 249.00, true),
  ('sakura-hand-wash', 'Sakura Handtvål', 159.00, true),
  ('morning-bloom-edp', 'Morning Bloom Eau de Parfum', 595.00, true),
  ('sakura-fragrance-sticks', 'Sakura Doftpinnar', 345.00, true),
  ('night-bloom-bath-oil', 'Night Bloom Badolja', 219.00, true),
  ('yozakura-pillow-mist', 'Yozakura Kuddspray', 179.00, true),
  ('yozakura-candle', 'Yozakura Doftljus', 299.00, true),
  ('sleep-body-balm', 'Sömn Kroppsbalsam', 229.00, true),
  ('yozakura-edp', 'Yozakura Eau de Parfum', 595.00, true),
  ('hinoki-shower-oil', 'Hinoki Duscholja', 169.00, true),
  ('hinoki-bar-soap', 'Hinoki Tvålkaka', 89.00, true),
  ('hinoki-candle', 'Hinoki Doftljus', 299.00, true),
  ('hinoki-room-spray', 'Hinoki Rumsspray', 199.00, true),
  ('hinoki-edp', 'Hinoki Eau de Parfum', 595.00, true),
  ('rice-milk-cleanser', 'Rismjölk Ansiktsrengöring', 239.00, true),
  ('rice-water-toner', 'Risvatten Ansiktsvatten', 269.00, true),
  ('rice-cream-moisturiser', 'Riskräm Fuktkräm', 395.00, true),
  ('rice-body-scrub', 'Ris Kroppsskrubb', 229.00, true),
  ('rice-hand-cream', 'Rismjölk Handkräm', 119.00, true),
  ('gift-morning-bloom', 'Morning Bloom Presentset', 449.00, true),
  ('gift-yozakura-night', 'Yozakura Night Presentset', 599.00, true),
  ('gift-hinoki-forest', 'Hinoki Forest Presentset', 489.00, true)
on conflict (id) do update set name = excluded.name, price = excluded.price, active = excluded.active;

-- Produkter som tagits bort ur catalog.js går inte längre att köpa
update products set active = false where id not in ('sakura-shower-foam', 'sakura-body-cream', 'sakura-hand-wash', 'morning-bloom-edp', 'sakura-fragrance-sticks', 'night-bloom-bath-oil', 'yozakura-pillow-mist', 'yozakura-candle', 'sleep-body-balm', 'yozakura-edp', 'hinoki-shower-oil', 'hinoki-bar-soap', 'hinoki-candle', 'hinoki-room-spray', 'hinoki-edp', 'rice-milk-cleanser', 'rice-water-toner', 'rice-cream-moisturiser', 'rice-body-scrub', 'rice-hand-cream', 'gift-morning-bloom', 'gift-yozakura-night', 'gift-hinoki-forest');
