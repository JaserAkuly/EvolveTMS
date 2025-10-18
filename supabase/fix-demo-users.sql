-- Fix demo users authentication
-- First, let's check if users exist and clean up if needed

-- Check current users
SELECT id, email, email_confirmed_at, encrypted_password IS NOT NULL as has_password 
FROM auth.users 
WHERE email LIKE '%@evolve.local';

-- Delete existing demo users if they exist (to start fresh)
DELETE FROM auth.users WHERE email LIKE '%@evolve.local';

-- Now create users with simpler method
-- Using Supabase's built-in functions for proper user creation

-- Create Admin User
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change,
    phone_change_token,
    email_change_token_current,
    email_change_confirm_status
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@evolve.local',
    crypt('password123', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    false,
    now(),
    now(),
    '',
    '',
    '',
    '',
    '',
    '',
    0
);

-- Create Carrier User
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change,
    phone_change_token,
    email_change_token_current,
    email_change_confirm_status
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'carrier@evolve.local',
    crypt('password123', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    false,
    now(),
    now(),
    '',
    '',
    '',
    '',
    '',
    '',
    0
);

-- Create Shipper User  
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change,
    phone_change_token,
    email_change_token_current,
    email_change_confirm_status
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'shipper@evolve.local',
    crypt('password123', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    false,
    now(),
    now(),
    '',
    '',
    '',
    '',
    '',
    '',
    0
);

-- Create Viewer User
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change,
    phone_change_token,
    email_change_token_current,
    email_change_confirm_status
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'viewer@evolve.local',
    crypt('password123', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    false,
    now(),
    now(),
    '',
    '',
    '',
    '',
    '',
    '',
    0
);

-- Verify all users were created properly
SELECT 
    id, 
    email, 
    email_confirmed_at IS NOT NULL as email_confirmed,
    encrypted_password IS NOT NULL as has_password,
    created_at
FROM auth.users 
WHERE email LIKE '%@evolve.local'
ORDER BY email;

-- Check that profiles were auto-created with correct roles
SELECT 
    u.email,
    p.role,
    p.created_at
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id  
WHERE u.email LIKE '%@evolve.local'
ORDER BY u.email;