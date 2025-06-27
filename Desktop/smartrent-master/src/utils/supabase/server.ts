import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const cookieStore = cookies();

  // cookies() returns a Promise in some Next.js versions, so handle accordingly
  const cookieHeader = Array.isArray(cookieStore)
    ? cookieStore.map((c: any) => `${c.name}=${c.value}`).join('; ')
    : '';

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        cookie: cookieHeader,
      },
    },
  });
}
