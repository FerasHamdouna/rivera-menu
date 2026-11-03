import 'server-only';
import { createClient as createPlainClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { supabaseAnonKey, supabaseUrl } from '@/lib/supabase/env';

/**
 * The single gate for admin pages and actions. Returns a Supabase client acting as the admin
 * (RLS "authenticated" policies apply) or redirects to the login page.
 * Until the default password is replaced, everything except the password page redirects there.
 */
export async function requireAdmin({ allowPendingPassword = false } = {}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');
  if (!allowPendingPassword && user.app_metadata?.must_change_password) redirect('/admin/password');
  return { supabase, user };
}

/** Checks a password without touching the session cookies. */
export async function passwordMatches(email: string, password: string) {
  const probe = createPlainClient(supabaseUrl(), supabaseAnonKey(), { auth: { persistSession: false, autoRefreshToken: false } });
  const { error } = await probe.auth.signInWithPassword({ email, password });
  if (!error) await probe.auth.signOut({ scope: 'local' });
  return !error;
}
