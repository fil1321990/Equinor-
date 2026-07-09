-- Enable RLS for all tables to ensure we can attach policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE "incomeRecords" ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_deposit_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable all access for all users" ON users;
DROP POLICY IF EXISTS "Enable all access for all users" ON transactions;
DROP POLICY IF EXISTS "Enable all access for all users" ON investments;
DROP POLICY IF EXISTS "Enable all access for all users" ON products;
DROP POLICY IF EXISTS "Enable all access for all users" ON commissions;
DROP POLICY IF EXISTS "Enable all access for all users" ON "incomeRecords";
DROP POLICY IF EXISTS "Enable all access for all users" ON app_settings;
DROP POLICY IF EXISTS "Enable all access for all users" ON system_deposit_accounts;
DROP POLICY IF EXISTS "Enable all access for all users" ON chat_messages;

-- Create policies that allow ALL operations (SELECT, INSERT, UPDATE, DELETE) for everyone
CREATE POLICY "Enable all access for all users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for all users" ON transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for all users" ON investments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for all users" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for all users" ON commissions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for all users" ON "incomeRecords" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for all users" ON app_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for all users" ON system_deposit_accounts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for all users" ON chat_messages FOR ALL USING (true) WITH CHECK (true);

-- Also insert the requested admin user
INSERT INTO users (id, name, email, phone, password, role, balance, "referralCode", "createdAt")
VALUES ('22222222-2222-2222-2222-222222222222', 'Admin Dorian', 'doriangrey0366@gmail.com', 'admin_dorian_phone', '882036', 'admin', 0, 'ADMINDOR', now())
ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password, role = 'admin';
