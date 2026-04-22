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
