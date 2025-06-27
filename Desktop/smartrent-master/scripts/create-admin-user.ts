#!/usr/bin/env ts-node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function createAdminUser(email: string, password: string) {
  try {
    // Create user with admin role
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: 'admin' },
    });

    if (error) {
      console.error('Error creating admin user:', error.message);
      process.exit(1);
    }

    console.log('Admin user created:', data);
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

// Replace with desired admin email and password
const adminEmail = 'mediasampro@gmail.com';
const adminPassword = 'Jacxcool@1';

createAdminUser(adminEmail, adminPassword);
