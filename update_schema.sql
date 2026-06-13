-- Safe update script to apply incremental changes to your existing database
-- This script does NOT drop your existing tables or delete existing user data

-- 1. Add balanceAlertThreshold to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS "balanceAlertThreshold" numeric;

-- 2. Create chat_messages table if it doesn't already exist
CREATE TABLE IF NOT EXISTS chat_messages (
  id text DEFAULT gen_random_uuid()::text PRIMARY KEY,
  "senderId" text REFERENCES users(id),
  "receiverId" text REFERENCES users(id),
  text text,
  timestamp timestamp with time zone DEFAULT now()
);

-- 3. Disable Row-Level Security for chat_messages just like the others
ALTER TABLE chat_messages DISABLE ROW LEVEL SECURITY;

-- (Optional) If you manually want to enable realtime on chat_messages table via SQL 
-- Note: Recreating the publication might throw an error if it exists, so you can do:
-- ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
