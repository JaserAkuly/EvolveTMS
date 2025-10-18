-- First create the users in auth.users manually via Supabase dashboard
-- These are the emails/passwords to create:
-- admin@evolve.local / password123
-- carrier@evolve.local / password123  
-- shipper@evolve.local / password123
-- viewer@evolve.local / password123

-- Then run this SQL to update their profiles with proper roles:
UPDATE profiles SET role = 'admin', display_name = 'Admin User', company_name = 'Evolve TMS' WHERE email = 'admin@evolve.local';
UPDATE profiles SET role = 'carrier', display_name = 'Carrier User', company_name = 'Fast Freight LLC' WHERE email = 'carrier@evolve.local';  
UPDATE profiles SET role = 'shipper', display_name = 'Shipper User', company_name = 'ABC Manufacturing' WHERE email = 'shipper@evolve.local';
UPDATE profiles SET role = 'viewer', display_name = 'Viewer User', company_name = 'Read Only Company' WHERE email = 'viewer@evolve.local';