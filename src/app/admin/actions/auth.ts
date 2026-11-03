'use server';

import { redirect } from 'next/navigation';
import { passwordMatches, requireAdmin } from '@/lib/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export type FormState = { error?: string; ok?: string } | null;

const str = (fd: FormData, k: string) => String(fd.get(k) ?? '').trim();
const MIN_PASSWORD = 8;

export async function login(_: FormState, fd: FormData): Promise<FormState> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: str(fd, 'email'), password: String(fd.get('password') ?? '') });
  if (error) return { error: 'الإيميل أو كلمة السر غلط' };
  redirect('/admin');
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

function checkNewPassword(fd: FormData): string | null {
  const pw = String(fd.get('new_password') ?? ''), again = String(fd.get('confirm_password') ?? '');
  if (pw.length < MIN_PASSWORD) return `كلمة السر لازم تكون ${MIN_PASSWORD} أحرف أو أكثر`;
  if (pw !== again) return 'كلمتين السر مش متطابقات';
  return null;
}

/** First login: replace the default password, then clear the flag (service role only can write app_metadata). */
export async function setFirstPassword(_: FormState, fd: FormData): Promise<FormState> {
  const { supabase, user } = await requireAdmin({ allowPendingPassword: true });
  const bad = checkNewPassword(fd);
  if (bad) return { error: bad };
  if (await passwordMatches(user.email!, String(fd.get('new_password')))) return { error: 'اختار كلمة سر غير المبدئية' };

  const { error } = await supabase.auth.updateUser({ password: String(fd.get('new_password')) });
  if (error) return { error: 'ما قدرنا نغيّر كلمة السر، جرّب مرة ثانية' };
  await createAdminClient().auth.admin.updateUserById(user.id, { app_metadata: { must_change_password: false } });
  redirect('/admin');
}

export async function changePassword(_: FormState, fd: FormData): Promise<FormState> {
  const { supabase, user } = await requireAdmin();
  if (!(await passwordMatches(user.email!, String(fd.get('current_password') ?? '')))) return { error: 'كلمة السر الحالية غلط' };
  const bad = checkNewPassword(fd);
  if (bad) return { error: bad };
  const { error } = await supabase.auth.updateUser({ password: String(fd.get('new_password')) });
  if (error) return { error: 'ما قدرنا نغيّر كلمة السر، جرّب مرة ثانية' };
  return { ok: 'تم تغيير كلمة السر' };
}

/**
 * Changes the login email right away through the service role. Supabase's own flow would mail a
 * confirmation to the old address too, and the default admin@rivera.local can't receive mail.
 * Typing the new address twice plus the current password guards against typos and hijacking.
 */
export async function changeEmail(_: FormState, fd: FormData): Promise<FormState> {
  const { user } = await requireAdmin();
  const email = str(fd, 'email').toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'الإيميل مش صحيح' };
  if (email !== str(fd, 'email_again').toLowerCase()) return { error: 'الإيميلين مش متطابقين' };
  if (!(await passwordMatches(user.email!, String(fd.get('current_password') ?? '')))) return { error: 'كلمة السر الحالية غلط' };

  const { error } = await createAdminClient().auth.admin.updateUserById(user.id, { email, email_confirm: true });
  if (error) return { error: 'ما قدرنا نغيّر الإيميل، جرّب مرة ثانية' };
  // The session token still carries the old email; sign in again with the new one.
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login?email-changed=1');
}
