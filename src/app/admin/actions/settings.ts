'use server';

import { refresh, updateTag } from 'next/cache';
import { requireAdmin } from '@/lib/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { IMAGES_BUCKET } from '@/lib/supabase/env';
import { MENU_TAG } from '@/lib/public-menu';
import type { FormState } from './auth';

export type SettingsPayload = {
  logo_path: string | null;
  phone: string;
  address: string;
  hours_text: string;
  instagram_url: string;
  facebook_url: string;
  extra_links: { label: string; url: string }[];
};

const isUrl = (v: string) => /^https?:\/\/\S+\.\S+/.test(v);

export async function updateSettings(_: FormState, fd: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  let p: SettingsPayload;
  try { p = JSON.parse(String(fd.get('data'))); } catch { return { error: 'بيانات غير صالحة' }; }

  const links = p.extra_links.map((l) => ({ label: l.label.trim(), url: l.url.trim() })).filter((l) => l.label || l.url);
  for (const url of [p.instagram_url.trim(), p.facebook_url.trim(), ...links.map((l) => l.url)]) {
    if (url && !isUrl(url)) return { error: `الرابط "${url}" لازم يبدأ بـ https://` };
  }
  if (links.some((l) => !l.label)) return { error: 'كل رابط إضافي لازم يكون إله اسم' };

  const { data: before } = await supabase.from('settings').select('logo_path').single();
  const { error } = await supabase.from('settings').update({
    logo_path: p.logo_path,
    phone: p.phone.trim(),
    address: p.address.trim(),
    hours_text: p.hours_text.trim(),
    instagram_url: p.instagram_url.trim() || null,
    facebook_url: p.facebook_url.trim() || null,
    extra_links: links,
    updated_at: new Date().toISOString(),
  }).eq('id', true);
  if (error) return { error: 'ما انحفظت الإعدادات، جرّب مرة ثانية' };
  if (before?.logo_path && before.logo_path !== p.logo_path) await createAdminClient().storage.from(IMAGES_BUCKET).remove([before.logo_path]); // see removeImages in menu.ts

  updateTag(MENU_TAG);
  refresh();
  return { ok: 'انحفظت الإعدادات' };
}
