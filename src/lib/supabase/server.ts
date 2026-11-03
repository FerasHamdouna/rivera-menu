import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { connection } from 'next/server';
import { supabaseAnonKey, supabaseUrl } from './env';

// Per-request client for Server Components, Server Actions and Route Handlers.
// Carries the admin's session cookie when there is one, otherwise acts as the public (anon) role.
export async function createClient() {
  // Session checks use the current time; mark the render as request-time before supabase-js runs.
  await connection();
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl(), supabaseAnonKey(), {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component, where cookies are read-only; the proxy refreshes the session instead.
        }
      },
    },
  });
}
