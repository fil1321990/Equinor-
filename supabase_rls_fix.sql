-- Disable RLS on all tables temporarily for the prototype so the frontend can read/write freely
-- Run this in your Supabase SQL Editor

ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE investments DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE commissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE "incomeRecords" DISABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE system_deposit_accounts DISABLE ROW LEVEL SECURITY;

-- If you want to keep RLS enabled but allow public access instead, run these instead:
/*
CREATE POLICY "Enable all access for all users" ON users FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON transactions FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON investments FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON products FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON commissions FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON "incomeRecords" FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON app_settings FOR ALL USING (true);
CREATCopy the contents of the supabase_setup_final.sql file.
E POLICY "Enable all access for all users" ON system_deposit_accounts FOR ALL USING (true);
*/
