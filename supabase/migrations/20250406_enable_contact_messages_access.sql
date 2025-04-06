
-- Create function to enable contact messages access
CREATE OR REPLACE FUNCTION public.enable_contact_messages_access()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Drop existing RLS policies if they exist
  DROP POLICY IF EXISTS "Allow public to insert contact messages" ON public.contact_messages;
  DROP POLICY IF EXISTS "Allow public to view contact messages" ON public.contact_messages;
  
  -- Create policy to allow public insert of contact messages
  CREATE POLICY "Allow public to insert contact messages" 
    ON public.contact_messages 
    FOR INSERT 
    TO anon, authenticated 
    WITH CHECK (true);
    
  -- Create policy to allow public select of contact messages
  CREATE POLICY "Allow public to view contact messages" 
    ON public.contact_messages 
    FOR SELECT 
    TO anon, authenticated 
    USING (true);
END;
$$;

-- Execute the function to set up policies
SELECT enable_contact_messages_access();
