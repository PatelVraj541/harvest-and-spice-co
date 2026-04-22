-- Seed data for development
-- Run this after all migrations

-- Categories
INSERT INTO categories (id, name, slug, description, type, sort_order) VALUES
  ('a1b2c3d4-1111-1111-1111-111111111111', 'Whole Spices', 'whole-spices', 'Premium whole spices, sun-dried and hand-sorted', 'spice', 1),
  ('a1b2c3d4-2222-2222-2222-222222222222', 'Ground Spices', 'ground-spices', 'Freshly ground spices for everyday cooking', 'spice', 2),
  ('a1b2c3d4-3333-3333-3333-333333333333', 'Spice Blends', 'spice-blends', 'Curated blends for specific cuisines and dishes', 'spice', 3),
  ('a1b2c3d4-4444-4444-4444-444444444444', 'Tropical Fruits', 'tropical-fruits', 'Seasonal tropical fruits from India', 'fruit', 4),
  ('a1b2c3d4-5555-5555-5555-555555555555', 'Citrus & Berries', 'citrus-berries', 'Fresh citrus fruits and seasonal berries', 'fruit', 5);

-- Products: Spices (non-seasonal, always available)
INSERT INTO products (id, category_id, name, slug, short_description, description, origin, is_active, is_seasonal, is_subscribable) VALUES
  ('b1b2c3d4-0001-0001-0001-000000000001', 'a1b2c3d4-1111-1111-1111-111111111111', 'Organic Black Pepper', 'organic-black-pepper', 'Bold, aromatic whole peppercorns from Wayanad', 'Premium Tellicherry black pepper, hand-picked from organic farms in Wayanad, Kerala. These large, plump peppercorns are sun-dried to develop their bold, complex flavor with hints of pine and citrus.', 'Wayanad, Kerala', true, false, true),
  ('b1b2c3d4-0002-0002-0002-000000000002', 'a1b2c3d4-2222-2222-2222-222222222222', 'Kashmiri Saffron', 'kashmiri-saffron', 'Pure Mongra saffron — the world''s finest', 'Grade-1 Mongra saffron hand-harvested from the fields of Pampore, Kashmir. Each strand is carefully selected for its deep red color and intense aroma. Perfect for biryanis, desserts, and golden milk.', 'Pampore, Kashmir', true, false, true),
  ('b1b2c3d4-0003-0003-0003-000000000003', 'a1b2c3d4-2222-2222-2222-222222222222', 'Organic Turmeric Powder', 'organic-turmeric', 'High-curcumin Lakadong turmeric from Meghalaya', 'Lakadong variety turmeric from Meghalaya with 7-9% curcumin content — among the highest in the world. Stone-ground to preserve nutrients and vibrant color.', 'Meghalaya', true, false, true),
  ('b1b2c3d4-0004-0004-0004-000000000004', 'a1b2c3d4-1111-1111-1111-111111111111', 'Kerala Cardamom', 'kerala-cardamom', 'Fragrant green cardamom pods from Idukki', 'Premium 8mm+ green cardamom pods from the Idukki hills of Kerala. Bold, eucalyptus-sweet aroma — the queen of spices.', 'Idukki, Kerala', true, false, true),
  ('b1b2c3d4-0005-0005-0005-000000000005', 'a1b2c3d4-3333-3333-3333-333333333333', 'Garam Masala', 'garam-masala', 'Aromatic 9-spice blend, small-batch roasted', 'Our signature garam masala, blended from 9 whole spices — cinnamon, cardamom, cloves, black pepper, cumin, coriander, bay leaf, mace, and nutmeg. Small-batch roasted and ground.', 'House Blend', true, false, true);

-- Products: Seasonal Fruits
INSERT INTO products (id, category_id, name, slug, short_description, description, origin, is_active, is_seasonal, is_subscribable) VALUES
  ('b1b2c3d4-0006-0006-0006-000000000006', 'a1b2c3d4-4444-4444-4444-444444444444', 'Alphonso Mangoes', 'alphonso-mangoes', 'The king of mangoes — Ratnagiri Hapus', 'Premium Alphonso (Hapus) mangoes from Ratnagiri, Maharashtra. Naturally ripened, carbide-free. The gold standard of mangoes — creamy flesh, zero fiber, intoxicating aroma.', 'Ratnagiri, Maharashtra', true, true, false),
  ('b1b2c3d4-0007-0007-0007-000000000007', 'a1b2c3d4-5555-5555-5555-555555555555', 'Nagpur Oranges', 'nagpur-oranges', 'Sweet, juicy oranges from the Orange City', 'Nagpur Santra — hand-picked from orchards in Maharashtra. Known for their perfect sweet-tart balance and easy-peel skin. Best enjoyed fresh during winter months.', 'Nagpur, Maharashtra', true, true, false),
  ('b1b2c3d4-0008-0008-0008-000000000008', 'a1b2c3d4-5555-5555-5555-555555555555', 'Mahabaleshwar Strawberries', 'mahabaleshwar-strawberries', 'Sweet, juicy strawberries from the hills', 'Premium strawberries grown in the cool climate of Mahabaleshwar, Maharashtra. Picked at peak ripeness for maximum sweetness and flavor.', 'Mahabaleshwar, Maharashtra', true, true, false);

-- Product Variants: Spice weight options (50g, 100g, 500g)
INSERT INTO product_variants (product_id, label, weight_grams, unit, price_cents, compare_at_price_cents, stock_quantity, sku, sort_order) VALUES
  -- Black Pepper
  ('b1b2c3d4-0001-0001-0001-000000000001', '50g',  50,  'g', 14900, 19900, 100, 'BPP-50G',  1),
  ('b1b2c3d4-0001-0001-0001-000000000001', '100g', 100, 'g', 27900, 37900, 80,  'BPP-100G', 2),
  ('b1b2c3d4-0001-0001-0001-000000000001', '500g', 500, 'g', 119900, 169900, 30, 'BPP-500G', 3),
  -- Saffron (smaller quantities, premium pricing)
  ('b1b2c3d4-0002-0002-0002-000000000002', '1g',   1,   'g', 49900, NULL, 50,  'SAF-1G',   1),
  ('b1b2c3d4-0002-0002-0002-000000000002', '2g',   2,   'g', 89900, 99900, 40,  'SAF-2G',   2),
  ('b1b2c3d4-0002-0002-0002-000000000002', '5g',   5,   'g', 199900, NULL, 20, 'SAF-5G',   3),
  -- Turmeric
  ('b1b2c3d4-0003-0003-0003-000000000003', '100g', 100, 'g', 19900, 24900, 120, 'TUR-100G', 1),
  ('b1b2c3d4-0003-0003-0003-000000000003', '250g', 250, 'g', 44900, 54900, 80,  'TUR-250G', 2),
  ('b1b2c3d4-0003-0003-0003-000000000003', '500g', 500, 'g', 79900, 99900, 50,  'TUR-500G', 3),
  -- Cardamom
  ('b1b2c3d4-0004-0004-0004-000000000004', '50g',  50,  'g', 29900, NULL, 60,  'CAR-50G',  1),
  ('b1b2c3d4-0004-0004-0004-000000000004', '100g', 100, 'g', 54900, 59900, 40,  'CAR-100G', 2),
  ('b1b2c3d4-0004-0004-0004-000000000004', '250g', 250, 'g', 124900, 139900, 20, 'CAR-250G', 3),
  -- Garam Masala
  ('b1b2c3d4-0005-0005-0005-000000000005', '50g',  50,  'g', 9900, NULL, 150, 'GAR-50G',  1),
  ('b1b2c3d4-0005-0005-0005-000000000005', '100g', 100, 'g', 17900, 19900, 100, 'GAR-100G', 2),
  ('b1b2c3d4-0005-0005-0005-000000000005', '500g', 500, 'g', 74900, 89900, 40,  'GAR-500G', 3);

-- Product Variants: Fruit size options
INSERT INTO product_variants (product_id, label, weight_grams, unit, price_cents, compare_at_price_cents, stock_quantity, sku, sort_order) VALUES
  -- Alphonso Mangoes
  ('b1b2c3d4-0006-0006-0006-000000000006', '6 pieces',  NULL, 'piece', 59900, NULL, 50,  'MNG-6PC',  1),
  ('b1b2c3d4-0006-0006-0006-000000000006', '1 dozen',   NULL, 'dozen', 99900, 119900, 30, 'MNG-12PC', 2),
  ('b1b2c3d4-0006-0006-0006-000000000006', 'Gift Box',  NULL, 'box',   149900, NULL, 20,  'MNG-GIFT', 3),
  -- Nagpur Oranges
  ('b1b2c3d4-0007-0007-0007-000000000007', '1 kg',      1000, 'kg', 14900, NULL, 80,  'ORG-1KG',  1),
  ('b1b2c3d4-0007-0007-0007-000000000007', '3 kg',      3000, 'kg', 39900, 44900, 50, 'ORG-3KG',  2),
  ('b1b2c3d4-0007-0007-0007-000000000007', '5 kg',      5000, 'kg', 59900, 74900, 30, 'ORG-5KG',  3),
  -- Strawberries
  ('b1b2c3d4-0008-0008-0008-000000000008', '250g',      250, 'g', 19900, NULL, 100, 'STR-250G', 1),
  ('b1b2c3d4-0008-0008-0008-000000000008', '500g',      500, 'g', 34900, 39900, 60, 'STR-500G', 2),
  ('b1b2c3d4-0008-0008-0008-000000000008', '1 kg',      1000, 'kg', 59900, 69900, 30, 'STR-1KG', 3);

-- Seasonal Rules (only for seasonal fruits)
INSERT INTO product_seasonal_rules (product_id, available_from_month, available_to_month, label, is_active) VALUES
  -- Alphonso Mangoes: April to July
  ('b1b2c3d4-0006-0006-0006-000000000006', 4, 7, 'Mango Season', true),
  -- Nagpur Oranges: November to February (cross-year)
  ('b1b2c3d4-0007-0007-0007-000000000007', 11, 2, 'Orange Season', true),
  -- Strawberries: December to March (cross-year)
  ('b1b2c3d4-0008-0008-0008-000000000008', 12, 3, 'Strawberry Season', true);

-- Subscription Plans
INSERT INTO subscription_plans (name, slug, description, interval, interval_count, price_cents, is_active) VALUES
  ('Monthly Spice Box', 'monthly-spice-box', 'A curated box of 4-5 premium spices delivered every month with recipe cards and origin stories.', 'month', 1, 49900, true),
  ('Quarterly Discovery', 'quarterly-discovery', 'A larger box of 8-10 spices with a seasonal theme, delivered every 3 months.', 'quarter', 3, 129900, true);
