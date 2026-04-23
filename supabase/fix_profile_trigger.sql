-- Fix: Allow the trigger function to insert into profiles
-- The handle_new_user() trigger needs to bypass RLS to create the initial profile

-- Option 1: Add an INSERT policy for service role (trigger uses SECURITY DEFINER)
CREATE POLICY "Service role can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (true);

-- Option 2: Also grant necessary permissions
GRANT INSERT ON profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT INSERT ON profiles TO supabase_auth_admin;
GRANT SELECT ON profiles TO supabase_auth_admin;

-- Recreate the function with proper SET search_path
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
