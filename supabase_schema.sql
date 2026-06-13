-- Supabase Schema for Iconic Appley

CREATE TABLE users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
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

CREATE TABLE transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "userId" uuid REFERENCES users(id),
  type text,
  amount numeric,
  status text DEFAULT 'pending',
  date timestamp with time zone DEFAULT now(),
  "bankDetails" jsonb
);

CREATE TABLE investments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "userId" uuid REFERENCES users(id),
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

CREATE TABLE products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
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

CREATE TABLE commissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "userId" uuid REFERENCES users(id),
  "fromUserId" uuid REFERENCES users(id),
  amount numeric,
  date timestamp with time zone DEFAULT now(),
  level integer,
  type text
);

CREATE TABLE "incomeRecords" (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "userId" uuid REFERENCES users(id),
  "investmentId" uuid REFERENCES investments(id),
  "planName" text,
  amount numeric,
  date timestamp with time zone DEFAULT now()
);

CREATE TABLE app_settings (
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

INSERT INTO app_settings (id) VALUES (1);

CREATE TABLE system_deposit_accounts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "bankName" text,
  "accountName" text,
  "accountNumber" text
);

-- Insert demo users
INSERT INTO users (id, name, email, phone, password, role, balance, "referralCode", "createdAt")
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Admin', 'doriangrey0366@gmail.com', 'admin_phone_temp', '882036', 'admin', 0, 'ADMINX', now()),
  ('22222222-2222-2222-2222-222222222222', 'Demo User', 'user@iconic.com', '1234567890', 'password123', 'user', 5000000, '893475', now());

-- Insert dummy products
INSERT INTO products (id, name, title, roi, min, days, type) VALUES
  ('33333333-3333-3333-3333-333333333331', 'Starter VIP', 'EQUINOR', 12, 20000, 30, 'general'),
  ('33333333-3333-3333-3333-333333333332', 'Basic VIP', 'EQUINOR', 12, 30000, 30, 'general'),
  ('33333333-3333-3333-3333-333333333333', 'Standard VIP', 'EQUINOR', 12, 40000, 30, 'general');
