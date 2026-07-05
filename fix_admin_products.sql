-- 1. Add missing columns used by the admin form
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS "description" text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS "promoClosingDate" timestamptz;

-- 2. Allow the app to insert, update, and delete products (fixes RLS blocking admin)
DROP POLICY IF EXISTS "Allow ALL on products" ON public.products;
CREATE POLICY "Allow ALL on products"
ON public.products FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);
