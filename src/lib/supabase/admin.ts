import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { supabaseServiceKey, supabaseUrl } from './env';

// Service-role client: bypasses RLS. Server-only, for account management
// (e.g. clearing the forced password change flag), never for menu reads.
export function createAdminClient() {
  return createClient(supabaseUrl(), supabaseServiceKey(), {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
