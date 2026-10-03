-- Add payment_method column to orders table for COD support
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS payment_method TEXT NOT NULL DEFAULT 'cod'
CHECK (payment_method IN ('cod', 'stripe', 'upi'));
