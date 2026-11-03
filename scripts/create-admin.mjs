// Creates the single admin account from ADMIN_EMAIL / ADMIN_PASSWORD in .env.local.
// The account is flagged so the first login must change the default password.
// Run: npm run admin:create   (safe to re-run: an existing account is left untouched)
import { createClient } from '@supabase/supabase-js';

const { NEXT_PUBLIC_SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: key, ADMIN_EMAIL: email, ADMIN_PASSWORD: password } = process.env;
for (const [name, v] of Object.entries({ NEXT_PUBLIC_SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: key, ADMIN_EMAIL: email, ADMIN_PASSWORD: password })) {
  if (!v) {
    console.error(`Missing ${name} in .env.local`);
    process.exit(1);
  }
}

const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

const { data: list, error: listError } = await supabase.auth.admin.listUsers();
if (listError) throw listError;
if (list.users.length > 0) {
  console.log(`An admin account already exists (${list.users.map((u) => u.email).join(', ')}). Nothing to do.`);
  process.exit(0);
}

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  // app_metadata is writable only with the service role, so the admin can't clear the flag client-side.
  app_metadata: { must_change_password: true },
});
if (error) throw error;
console.log(`Created admin ${data.user.email}. The first login will ask for a new password.`);
