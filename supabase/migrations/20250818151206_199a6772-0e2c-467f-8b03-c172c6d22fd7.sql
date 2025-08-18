-- Fix RLS policies to allow admin operations on products table
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
DROP POLICY IF EXISTS "Admin can manage products" ON public.products;
DROP POLICY IF EXISTS "Admin can insert products" ON public.products;
DROP POLICY IF EXISTS "Admin can update products" ON public.products;
DROP POLICY IF EXISTS "Admin can delete products" ON public.products;

-- Create comprehensive RLS policies for products
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

CREATE POLICY "Admin can insert products" 
ON public.products 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admin can update products" 
ON public.products 
FOR UPDATE 
USING (true);

CREATE POLICY "Admin can delete products" 
ON public.products 
FOR DELETE 
USING (true);

-- Update orders table policies for admin access
DROP POLICY IF EXISTS "Orders are viewable by everyone" ON public.orders;
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;

CREATE POLICY "Orders are viewable by everyone" 
ON public.orders 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admin can update orders" 
ON public.orders 
FOR UPDATE 
USING (true);

CREATE POLICY "Admin can delete orders" 
ON public.orders 
FOR DELETE 
USING (true);

-- Update contact_messages policies for admin access
CREATE POLICY "Admin can delete contact messages" 
ON public.contact_messages 
FOR DELETE 
USING (true);

CREATE POLICY "Admin can update contact messages" 
ON public.contact_messages 
FOR UPDATE 
USING (true);

-- Update product_comments policies for admin access
CREATE POLICY "Admin can delete product comments" 
ON public.product_comments 
FOR DELETE 
USING (true);

CREATE POLICY "Admin can update product comments" 
ON public.product_comments 
FOR UPDATE 
USING (true);