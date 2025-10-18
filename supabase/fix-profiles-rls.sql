-- Drop existing policies that might be causing recursion
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON profiles;

-- Create simple, non-recursive policies
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Allow all authenticated users to view all profiles (for admin purposes)
-- Remove this if you want stricter access control
CREATE POLICY "Authenticated users can view all profiles" 
ON profiles FOR SELECT 
USING (auth.role() = 'authenticated');