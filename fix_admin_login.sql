-- Disable RLS on all tables to allow public access
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE investments DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE commissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE "incomeRecords" DISABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE system_deposit_accounts DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages DISABLE ROW LEVEL SECURITY;

-- Insert the requested admin user explicitly
INSERT INTO users (id, name, email, phone, password, role, balance, "referralCode", "createdAt")
VALUES ('22222222-2222-2222-2222-222222222222', 'Admin Dorian', 'doriangrey0366@gmail.com', 'admin_dorian_phone', '882036', 'admin', 0, 'ADMINDOR', now())
ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password, role = 'admin';

-- If phone is used instead of email for conflict resolution:
-- ON CONFLICT (phone) DO UPDATE SET password = EXCLUDED.password, role = 'admin';
