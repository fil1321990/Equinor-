-- Add missing columns if they don't exist
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS "promoClosingDate" timestamptz;

-- Add RLS policies for products to allow all operations (since app relies on anon key)
CREATE POLICY "Allow ALL on products"
ON public.products FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);
