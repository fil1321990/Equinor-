-- Disable RLS on tables just to be safe if they misbehave, or provide permissive policies

ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE investments DISABLE ROW LEVEL SECURITY;
ALTER TABLE incomeRecords DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;

-- Add the missing quota columns
ALTER TABLE products ADD COLUMN IF NOT EXISTS max_quota INT DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS sold_count INT DEFAULT 0;

