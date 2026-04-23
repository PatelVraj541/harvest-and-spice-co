-- ========================================
-- 001_create_profiles.sql
-- ========================================
-- Migration 001: Create profiles and addresses tables
-- Extends Supabase Auth with business-specific user data

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Addresses table
CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  label TEXT NOT NULL DEFAULT 'Home',
  line1 TEXT NOT NULL,
  line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'IN',
  is_default BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_addresses_user ON addresses(user_id);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can view own addresses"
  ON addresses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own addresses"
  ON addresses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses"
  ON addresses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses"
  ON addresses FOR DELETE
  USING (auth.uid() = user_id);


-- ========================================
-- 002_create_categories.sql
-- ========================================
-- Migration 002: Create categories table

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  type TEXT NOT NULL CHECK (type IN ('spice', 'fruit')),
  sort_order INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_categories_type ON categories(type);
CREATE INDEX idx_categories_slug ON categories(slug);

-- RLS: publicly readable, admin-writable
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are publicly readable"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert categories"
  ON categories FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can update categories"
  ON categories FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can delete categories"
  ON categories FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- ========================================
-- 003_create_products.sql
-- ========================================
-- Migration 003: Create products, product_variants, and product_images tables

-- Products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  origin TEXT,
  nutrition_info JSONB,
  tags JSONB,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_seasonal BOOLEAN NOT NULL DEFAULT false,
  is_subscribable BOOLEAN NOT NULL DEFAULT false,
  primary_image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_active ON products(is_active);

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Product Variants (handles weight options: 50g, 100g, 500g for spices; unit options for fruits)
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  label TEXT NOT NULL,           -- e.g., "50g", "100g", "500g", "1 dozen"
  weight_grams INT,             -- nullable for fruit (piece/dozen)
  unit TEXT NOT NULL DEFAULT 'g' CHECK (unit IN ('g', 'kg', 'piece', 'dozen', 'box')),
  price_cents INT NOT NULL,
  compare_at_price_cents INT,   -- strike-through price
  stock_quantity INT NOT NULL DEFAULT 0,
  sku TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_variants_sku ON product_variants(sku);

-- Product Images
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_images_product ON product_images(product_id);

-- RLS: publicly readable, admin-writable
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Products are publicly readable"
  ON products FOR SELECT USING (true);
CREATE POLICY "Variants are publicly readable"
  ON product_variants FOR SELECT USING (true);
CREATE POLICY "Images are publicly readable"
  ON product_images FOR SELECT USING (true);

-- Admin write
CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can insert variants"
  ON product_variants FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update variants"
  ON product_variants FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete variants"
  ON product_variants FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can insert images"
  ON product_images FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update images"
  ON product_images FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete images"
  ON product_images FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));


-- ========================================
-- 004_create_orders.sql
-- ========================================
-- Migration 004: Create orders, order_items, and cart_items tables

-- Cart Items
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity INT NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, variant_id)
);

CREATE INDEX idx_cart_user ON cart_items(user_id);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  order_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal_cents INT NOT NULL,
  shipping_cents INT NOT NULL DEFAULT 0,
  tax_cents INT NOT NULL DEFAULT 0,
  total_cents INT NOT NULL,
  shipping_address JSONB NOT NULL,
  stripe_payment_intent_id TEXT,
  stripe_checkout_session_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_number ON orders(order_number);

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Order Items (snapshots of product data at time of order)
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES product_variants(id),
  product_name TEXT NOT NULL,
  variant_label TEXT NOT NULL,
  quantity INT NOT NULL,
  unit_price_cents INT NOT NULL,
  total_cents INT NOT NULL
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- RLS
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Cart: users can CRUD own items
CREATE POLICY "Users can view own cart"
  ON cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to cart"
  ON cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cart"
  ON cart_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can remove from cart"
  ON cart_items FOR DELETE USING (auth.uid() = user_id);

-- Orders: users can read own, admins can update
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can create orders"
  ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Order items: users can read own order's items
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));
CREATE POLICY "System can insert order items"
  ON order_items FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));


-- ========================================
-- 005_create_subscriptions.sql
-- ========================================
-- Migration 005: Create subscription tables

-- Subscription Plans
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  interval TEXT NOT NULL CHECK (interval IN ('month', 'quarter')),
  interval_count INT NOT NULL DEFAULT 1,
  price_cents INT NOT NULL,
  stripe_price_id TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  image_url TEXT
);

-- Subscription Items (what's inside the box)
CREATE TABLE IF NOT EXISTS subscription_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES subscription_plans(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES product_variants(id),
  quantity INT NOT NULL DEFAULT 1
);

CREATE INDEX idx_sub_items_plan ON subscription_items(plan_id);

-- User Subscriptions
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'paused', 'cancelled', 'past_due')),
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_subs_user ON user_subscriptions(user_id);
CREATE INDEX idx_user_subs_status ON user_subscriptions(status);

CREATE TRIGGER user_subscriptions_updated_at
  BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Plans: public read
CREATE POLICY "Plans are publicly readable"
  ON subscription_plans FOR SELECT USING (true);
CREATE POLICY "Admins can manage plans"
  ON subscription_plans FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Items: public read
CREATE POLICY "Sub items are publicly readable"
  ON subscription_items FOR SELECT USING (true);
CREATE POLICY "Admins can manage sub items"
  ON subscription_items FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- User subs: own rows
CREATE POLICY "Users can view own subscriptions"
  ON user_subscriptions FOR SELECT USING (auth.uid() = user_id);


-- ========================================
-- 006_create_seasonal_rules.sql
-- ========================================
-- Migration 006: Create seasonal rules and availability function

-- Product Seasonal Rules
CREATE TABLE IF NOT EXISTS product_seasonal_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  available_from_month INT NOT NULL CHECK (available_from_month BETWEEN 1 AND 12),
  available_to_month INT NOT NULL CHECK (available_to_month BETWEEN 1 AND 12),
  available_from_day INT CHECK (available_from_day BETWEEN 1 AND 31),
  available_to_day INT CHECK (available_to_day BETWEEN 1 AND 31),
  label TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX idx_seasonal_product ON product_seasonal_rules(product_id);

-- Seasonal availability function
CREATE OR REPLACE FUNCTION is_product_available(
  p_product_id UUID,
  p_check_date DATE DEFAULT CURRENT_DATE
)
RETURNS BOOLEAN AS $$
DECLARE
  has_rules BOOLEAN;
  is_available BOOLEAN;
  check_month INT := EXTRACT(MONTH FROM p_check_date);
  check_day INT := EXTRACT(DAY FROM p_check_date);
BEGIN
  -- Check if product has any active seasonal rules
  SELECT EXISTS(
    SELECT 1 FROM product_seasonal_rules
    WHERE product_id = p_product_id AND is_active = true
  ) INTO has_rules;

  -- No rules = always available
  IF NOT has_rules THEN RETURN true; END IF;

  -- Check if current date matches any active rule
  SELECT EXISTS(
    SELECT 1 FROM product_seasonal_rules
    WHERE product_id = p_product_id
      AND is_active = true
      AND (
        -- Same-year range (e.g., Mar-Jun)
        (available_from_month <= available_to_month
         AND check_month >= available_from_month
         AND check_month <= available_to_month)
        OR
        -- Cross-year range (e.g., Nov-Feb)
        (available_from_month > available_to_month
         AND (check_month >= available_from_month OR check_month <= available_to_month))
      )
      AND (available_from_day IS NULL OR check_day >= available_from_day)
      AND (available_to_day IS NULL OR check_day <= available_to_day)
  ) INTO is_available;

  RETURN is_available;
END;
$$ LANGUAGE plpgsql STABLE;

-- Storefront Products View (only shows active + seasonally available products)
CREATE OR REPLACE VIEW storefront_products AS
SELECT
  p.*,
  c.name AS category_name,
  c.slug AS category_slug,
  c.type AS category_type,
  COALESCE(
    json_agg(
      json_build_object(
        'id', pv.id,
        'label', pv.label,
        'weight_grams', pv.weight_grams,
        'unit', pv.unit,
        'price_cents', pv.price_cents,
        'compare_at_price_cents', pv.compare_at_price_cents,
        'stock_quantity', pv.stock_quantity,
        'sku', pv.sku
      ) ORDER BY pv.sort_order
    ) FILTER (WHERE pv.id IS NOT NULL AND pv.is_active),
    '[]'
  ) AS variants
FROM products p
JOIN categories c ON p.category_id = c.id
LEFT JOIN product_variants pv ON pv.product_id = p.id
WHERE p.is_active = true
  AND is_product_available(p.id)
GROUP BY p.id, c.name, c.slug, c.type;

-- RLS
ALTER TABLE product_seasonal_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Seasonal rules are publicly readable"
  ON product_seasonal_rules FOR SELECT USING (true);
CREATE POLICY "Admins can manage seasonal rules"
  ON product_seasonal_rules FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));


-- ========================================
-- seed.sql
-- ========================================
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

