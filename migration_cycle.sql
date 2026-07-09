-- Add new columns to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS total_duration_days int;
ALTER TABLE products ADD COLUMN IF NOT EXISTS payout_cycle_days int;

-- Add new columns to investments
ALTER TABLE investments ADD COLUMN IF NOT EXISTS total_duration_days int;
ALTER TABLE investments ADD COLUMN IF NOT EXISTS payout_cycle_days int;

-- Migrate existing data for products
UPDATE products 
SET 
  total_duration_days = 30,
  payout_cycle_days = COALESCE("tPlusDays", days, 1)
WHERE total_duration_days IS NULL;

-- Migrate existing data for investments
UPDATE investments 
SET 
  total_duration_days = 30,
  payout_cycle_days = COALESCE("tPlusDays", 1)
WHERE total_duration_days IS NULL;
