-- 0. Drop existing tables to ensure clean setup (WARNING: This deletes existing data)
DROP TABLE IF EXISTS "incomeRecords" CASCADE;
DROP TABLE IF EXISTS commissions CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS investments CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS app_settings CASCADE;
DROP TABLE IF EXISTS system_deposit_accounts CASCADE;

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS users (
  id text DEFAULT gen_random_uuid()::text PRIMARY KEY,
  name text,
  email text UNIQUE,
  phone text UNIQUE,
  password text,
  role text DEFAULT 'user',
  balance numeric DEFAULT 0,
  "referralCode" text UNIQUE,
  "referredBy" text,
  "referralEarnings" numeric DEFAULT 0,
  "withdrawalLimit" numeric,
  "bankDetails" jsonb,
  "vipLevelIndex" integer DEFAULT 0,
  avatar text,
  disabled boolean DEFAULT false,
  "createdAt" timestamp with time zone DEFAULT now(),
  "claimedTasks" jsonb DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS transactions (
  id text DEFAULT gen_random_uuid()::text PRIMARY KEY,
  "userId" text REFERENCES users(id),
  type text,
  amount numeric,
  status text DEFAULT 'pending',
  date timestamp with time zone DEFAULT now(),
  "bankDetails" jsonb
);

CREATE TABLE IF NOT EXISTS investments (
  id text DEFAULT gen_random_uuid()::text PRIMARY KEY,
  "userId" text REFERENCES users(id),
  "planName" text,
  amount numeric,
  "expectedRoi" numeric,
  "fixedDailyReturn" numeric,
  "startDate" timestamp with time zone,
  "endDate" timestamp with time zone,
  "lastCollectedDate" timestamp with time zone,
  status text DEFAULT 'active',
  "expiryNotified" boolean DEFAULT false,
  "tPlusDays" integer DEFAULT 1,
  quantity integer DEFAULT 1
);

CREATE TABLE IF NOT EXISTS products (
  id text DEFAULT gen_random_uuid()::text PRIMARY KEY,
  name text,
  title text,
  roi numeric,
  min numeric,
  days integer,
  type text,
  "fixedDailyReturn" numeric,
  "imageUrl" text,
  "tPlusDays" integer,
  "maxQuota" integer,
  "promotionalUnlockDate" timestamp with time zone
);

CREATE TABLE IF NOT EXISTS commissions (
  id text DEFAULT gen_random_uuid()::text PRIMARY KEY,
  "userId" text REFERENCES users(id),
  "fromUserId" text REFERENCES users(id),
  amount numeric,
  date timestamp with time zone DEFAULT now(),
  level integer,
  type text
);

CREATE TABLE IF NOT EXISTS "incomeRecords" (
  id text DEFAULT gen_random_uuid()::text PRIMARY KEY,
  "userId" text REFERENCES users(id),
  "investmentId" text REFERENCES investments(id),
  "planName" text,
  amount numeric,
  date timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS app_settings (
  id integer PRIMARY KEY DEFAULT 1,
  "globalWithdrawalLimit" numeric DEFAULT 5000000,
  "managerLink" text DEFAULT 'https://t.me/manager',
  "groupLink" text DEFAULT 'https://t.me/group',
  announcement text,
  "adminWhatsApp" text,
  "adminUsdtAddress" text,
  "promoImage" text,
  "aboutUsImage" text,
  "carouselImages" jsonb DEFAULT '["https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800"]'::jsonb
);

CREATE TABLE IF NOT EXISTS system_deposit_accounts (
  id text DEFAULT gen_random_uuid()::text PRIMARY KEY,
  "bankName" text,
  "accountName" text,
  "accountNumber" text
);


-- 2. Disable Row-Level Security (RLS) entirely so the public React frontend can read/write directly
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE investments DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE commissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE "incomeRecords" DISABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE system_deposit_accounts DISABLE ROW LEVEL SECURITY;

-- 3. Insert Initial System Settings & Configuration Data
INSERT INTO app_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Insert an Admin demo user 
INSERT INTO users (id, name, email, phone, password, role, balance, "referralCode", "createdAt")
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Admin', 'tarabasnookeracademy@gmail.com', 'admin_phone_temp', '1321990', 'admin', 0, 'ADMINX', now())
ON CONFLICT (id) DO NOTHING;

-- Insert some dummy products
INSERT INTO products (id, name, title, roi, min, days, type) 
VALUES
  ('33333333-3333-3333-3333-333333333331', 'Starter VIP', 'EQUINOR', 12, 20000, 30, 'general'),
  ('33333333-3333-3333-3333-333333333332', 'Basic VIP', 'EQUINOR', 12, 30000, 30, 'general'),
  ('33333333-3333-3333-3333-333333333333', 'Standard VIP', 'EQUINOR', 12, 40000, 30, 'general')
ON CONFLICT (id) DO NOTHING;
