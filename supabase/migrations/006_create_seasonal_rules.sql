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
