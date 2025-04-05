
-- This migration enables public access to the orders table for demo purposes
-- In a production environment, you should use proper authentication and authorization

-- First, enable RLS on orders table if not already enabled
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create a function to add policies
CREATE OR REPLACE FUNCTION public.create_orders_policy()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete existing policies if they exist
  DROP POLICY IF EXISTS "Allow anonymous select" ON orders;
  DROP POLICY IF EXISTS "Allow anonymous insert" ON orders;
  DROP POLICY IF EXISTS "Allow anonymous update" ON orders;
  
  -- Create policies for public access (for demo purposes only)
  CREATE POLICY "Allow anonymous select" ON orders FOR SELECT USING (true);
  CREATE POLICY "Allow anonymous insert" ON orders FOR INSERT WITH CHECK (true);
  CREATE POLICY "Allow anonymous update" ON orders FOR UPDATE USING (true);
END;
$$;

-- Execute the function to create policies
SELECT create_orders_policy();
