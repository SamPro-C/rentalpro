// scripts/create-admin-user.js

// --- ADD THIS LINE ---
require('dotenv').config();
// ---------------------

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pxfiwggdknicmccibwde.supabase.co';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4Zml3Z2dka25pY21jY2lid2RlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjAxMDU5MywiZXhwIjoyMDYxNTg2NTkzfQ.Jjcm9526soc_OLMrr33cmQUFjzJ34CRUNIuSkTaYXo8';

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  // These options are good practice for server-side Supabase clients
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createAdminUser(email, password) {
  try {
    // Create user with admin role
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Automatically confirms the email
      user_metadata: { role: 'admin' }, // Stores 'admin' role in user's metadata
    });

    if (error) {
      console.error('Error creating admin user:', error.message);
      process.exit(1);
    }

    console.log('Admin user created successfully:', data.user.email);
    console.log('User ID:', data.user.id);

    // Insert profile data into your users table
    const { error: profileError } = await supabase
      .from('users')
      .insert([
        {
          id: data.user.id,
          email: data.user.email,
          role: 'admin',
          approved: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

    if (profileError) {
      console.error('❌ Error inserting profile data:', profileError.message);
    } else {
      console.log('✅ Profile data inserted successfully.');
    }

    // Optional: If you use custom claims for RLS, set it here.
    // This requires the set_claim function to be deployed in your Supabase SQL editor.
    // const { data: claimData, error: claimError } = await supabase.rpc('set_claim', {
    //   uid: data.user.id,
    //   claim: 'role',
    //   value: 'admin'
    // });
    // if (claimError) {
    //   console.error("Error setting custom claim:", claimError.message);
    // } else {
    //   console.log("Custom claim 'role: admin' set for user.");
    // }

    process.exit(0); // Exit successfully
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1); // Exit with error
  }
}

// Replace with desired admin email and password from command line arguments
const adminEmail = process.argv[2];
const adminPassword = process.argv[3];

if (!adminEmail || !adminPassword) {
  console.error("Usage: node scripts/create-admin-user.js <email> <password>");
  process.exit(1);
}

// Using your provided default in case you forget args
// const adminEmail = 'mediasampro@gmail.com.com'; // Note: you had .com.com, fixed to one .com below if using hardcoded
// const adminPassword = 'Jacxcool@1';

createAdminUser(adminEmail, adminPassword);
