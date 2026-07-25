ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE commissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE "incomeRecords" DISABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE system_deposit_accounts DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE investments DISABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END $$;

-- Try adding tables to publication, ignoring errors if they're already added
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE users, transactions, investments, products, commissions, "incomeRecords", system_deposit_accounts, chat_messages;
EXCEPTION WHEN OTHERS THEN
  -- Do nothing
END $$;

ALTER TABLE products ADD COLUMN IF NOT EXISTS max_quota INT DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS sold_count INT DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS "globalQuota" INT DEFAULT 0;
