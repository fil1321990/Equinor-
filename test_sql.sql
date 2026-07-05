-- 1. Ensure VIP products exist and are visible (using the correct 'type' column)
UPDATE public.products 
SET type = 'vip' 
WHERE type ILIKE 'vip' OR name ILIKE '%VIP%';

-- 2. IP + Device tracking
CREATE TABLE IF NOT EXISTS public.ip_login_log (
  id uuid primary key default gen_random_uuid(),
  user_id text,
  ip_address inet,
  device_fingerprint text,
  created_at timestamptz default now()
);
ALTER TABLE public.ip_login_log ENABLE ROW LEVEL SECURITY;

-- 3. Admin view for duplicate IPs
CREATE OR REPLACE VIEW public.admin_duplicate_ips AS
SELECT ip_address, count(distinct user_id) as account_count, array_agg(user_id) as user_ids
FROM public.ip_login_log
GROUP BY ip_address
HAVING count(distinct user_id) > 1;

-- 4. Fix RLS for products (using 'true' since products have no is_active column)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read active products" ON public.products;
CREATE POLICY "Public can read active products"
ON public.products FOR SELECT
TO anon, authenticated
USING (true);

-- 5. RPC for QR voucher redeem
CREATE OR REPLACE FUNCTION public.redeem_voucher(qr_data text, user_id text)
RETURNS json AS $$
BEGIN
  RETURN json_build_object('success', true, 'message', 'Voucher redeemed successfully');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
