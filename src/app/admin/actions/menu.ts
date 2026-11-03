'use server';

import { refresh, updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import type { SupabaseClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { IMAGES_BUCKET } from '@/lib/supabase/env';
import { MENU_TAG } from '@/lib/public-menu';
import type { FormState } from './auth';

const str = (fd: FormData, k: string) => String(fd.get(k) ?? '').trim();
const orNull = (v: string) => (v ? v : null);

/** After any write: the public menu refetches on its next request, and the admin page re-renders. */
function changed() {
  updateTag(MENU_TAG);
  refresh();
}

type Table = 'sections' | 'items';

/** Swaps a row with its neighbour, then renumbers the siblings 0..n so gaps or duplicates never pile up. */
async function move(supabase: SupabaseClient, table: Table, id: string, dir: -1 | 1) {
  const scope = table === 'items' ? (await supabase.from('items').select('section_id').eq('id', id).single()).data?.section_id : null;
  let q = supabase.from(table).select('id').order('sort_order').order('created_at');
  if (scope) q = q.eq('section_id', scope);
  const { data } = await q;
  if (!data) return;
  const ids = data.map((r) => r.id as string);
  const i = ids.indexOf(id), j = i + dir;
  if (i < 0 || j < 0 || j >= ids.length) return;
  [ids[i], ids[j]] = [ids[j], ids[i]];
  await Promise.all(ids.map((rid, n) => supabase.from(table).update({ sort_order: n }).eq('id', rid)));
}

async function nextOrder(supabase: SupabaseClient, table: Table, sectionId?: string) {
  let q = supabase.from(table).select('sort_order').order('sort_order', { ascending: false }).limit(1);
  if (sectionId) q = q.eq('section_id', sectionId);
  const { data } = await q;
  return (data?.[0]?.sort_order ?? -1) + 1;
}

/**
 * Storage deletes need SELECT on storage.objects, which the admin role doesn't have (images are
 * read through public URLs). Callers have already passed requireAdmin, so use the service role.
 */
async function removeImages(paths: (string | null | undefined)[]) {
  const list = paths.filter((p): p is string => !!p);
  if (list.length) await createAdminClient().storage.from(IMAGES_BUCKET).remove(list);
}

// ---------- Sections ----------

function sectionFields(fd: FormData) {
  const name_ar = str(fd, 'name_ar'), icon = str(fd, 'icon');
  if (!name_ar) return { error: 'اكتب اسم القسم بالعربي' } as const;
  if (!icon) return { error: 'اختار أيقونة للقسم' } as const;
  return { data: { name_ar, name_en: orNull(str(fd, 'name_en')), icon } } as const;
}

export async function createSection(_: FormState, fd: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const f = sectionFields(fd);
  if ('error' in f) return { error: f.error };
  const { data, error } = await supabase.from('sections').insert({ ...f.data, sort_order: await nextOrder(supabase, 'sections') }).select('id').single();
  if (error) return { error: 'ما انحفظ القسم، جرّب مرة ثانية' };
  updateTag(MENU_TAG);
  redirect(`/admin/sections/${data.id}`);
}

export async function updateSection(id: string, _: FormState, fd: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const f = sectionFields(fd);
  if ('error' in f) return { error: f.error };
  const { error } = await supabase.from('sections').update(f.data).eq('id', id);
  if (error) return { error: 'ما انحفظ القسم، جرّب مرة ثانية' };
  changed();
  return { ok: 'انحفظ' };
}

export async function moveSection(id: string, dir: -1 | 1) {
  const { supabase } = await requireAdmin();
  await move(supabase, 'sections', id, dir);
  changed();
}

export async function setSectionHidden(id: string, hidden: boolean) {
  const { supabase } = await requireAdmin();
  await supabase.from('sections').update({ is_hidden: hidden }).eq('id', id);
  changed();
}

/** Deletes the section with all its items (cascade), and their photos. */
export async function deleteSection(id: string) {
  const { supabase } = await requireAdmin();
  const { data: items } = await supabase.from('items').select('image_path').eq('section_id', id);
  await supabase.from('sections').delete().eq('id', id);
  await removeImages(items?.map((i) => i.image_path) ?? []);
  updateTag(MENU_TAG);
  redirect('/admin');
}

// ---------- Items ----------

export type ItemPayload = {
  name_ar: string;
  name_en: string;
  desc_ar: string;
  desc_en: string;
  price: string;
  image_path: string | null;
  sizes: { name_ar: string; name_en: string; price: string }[];
  flavors: { name_ar: string; name_en: string }[];
};

const toPrice = (v: string) => {
  const n = Number(v.replace(',', '.'));
  return v.trim() !== '' && Number.isFinite(n) && n >= 0 ? Math.round(n * 100) / 100 : null;
};

function parseItem(raw: FormDataEntryValue | null) {
  let p: ItemPayload;
  try { p = JSON.parse(String(raw)); } catch { return { error: 'بيانات غير صالحة' } as const; }
  const name_ar = p.name_ar?.trim();
  if (!name_ar) return { error: 'اكتب اسم الصنف بالعربي' } as const;
  const sizes = p.sizes.filter((s) => s.name_ar.trim() || s.price.trim());
  for (const s of sizes) {
    if (!s.name_ar.trim()) return { error: 'كل حجم لازم يكون إله اسم' } as const;
    if (/^[\d٠-٩.,\s]+$/.test(s.name_ar)) return { error: `اسم الحجم "${s.name_ar.trim()}" رقم. اكتب اسم مثل "صغير"، وحط الرقم بخانة السعر` } as const;
    if (toPrice(s.price) == null) return { error: `اكتب سعر صحيح للحجم "${s.name_ar}"` } as const;
  }
  if (!sizes.length && p.price.trim() && toPrice(p.price) == null) return { error: 'السعر لازم يكون رقم' } as const;
  return {
    row: {
      name_ar,
      name_en: orNull(p.name_en.trim()),
      desc_ar: orNull(p.desc_ar.trim()),
      desc_en: orNull(p.desc_en.trim()),
      price: sizes.length ? null : toPrice(p.price),
      image_path: p.image_path,
    },
    sizes: sizes.map((s, i) => ({ name_ar: s.name_ar.trim(), name_en: orNull(s.name_en.trim()), price: toPrice(s.price)!, sort_order: i })),
    flavors: p.flavors.filter((f) => f.name_ar.trim()).map((f, i) => ({ name_ar: f.name_ar.trim(), name_en: orNull(f.name_en.trim()), sort_order: i })),
  } as const;
}

async function writeChildren(supabase: SupabaseClient, itemId: string, parsed: Exclude<ReturnType<typeof parseItem>, { error: string }>) {
  await Promise.all([supabase.from('item_sizes').delete().eq('item_id', itemId), supabase.from('item_flavors').delete().eq('item_id', itemId)]);
  const writes = [];
  if (parsed.sizes.length) writes.push(supabase.from('item_sizes').insert(parsed.sizes.map((s) => ({ ...s, item_id: itemId }))));
  if (parsed.flavors.length) writes.push(supabase.from('item_flavors').insert(parsed.flavors.map((f) => ({ ...f, item_id: itemId }))));
  const results = await Promise.all(writes);
  return results.find((r) => r.error)?.error ?? null;
}

export async function createItem(sectionId: string, _: FormState, fd: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const parsed = parseItem(fd.get('data'));
  if ('error' in parsed) return { error: parsed.error };
  const { data, error } = await supabase.from('items')
    .insert({ ...parsed.row, section_id: sectionId, sort_order: await nextOrder(supabase, 'items', sectionId) })
    .select('id').single();
  if (error) return { error: 'ما انحفظ الصنف، جرّب مرة ثانية' };
  if (await writeChildren(supabase, data.id, parsed)) return { error: 'انحفظ الصنف بس الأحجام أو النكهات ما انحفظت' };
  updateTag(MENU_TAG);
  redirect(`/admin/sections/${sectionId}`);
}

export async function updateItem(id: string, _: FormState, fd: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const parsed = parseItem(fd.get('data'));
  if ('error' in parsed) return { error: parsed.error };
  const { data: before } = await supabase.from('items').select('section_id, image_path').eq('id', id).single();
  if (!before) return { error: 'الصنف مش موجود' };
  const { error } = await supabase.from('items').update(parsed.row).eq('id', id);
  if (error) return { error: 'ما انحفظ الصنف، جرّب مرة ثانية' };
  if (await writeChildren(supabase, id, parsed)) return { error: 'انحفظ الصنف بس الأحجام أو النكهات ما انحفظت' };
  if (before.image_path && before.image_path !== parsed.row.image_path) await removeImages([before.image_path]);
  updateTag(MENU_TAG);
  redirect(`/admin/sections/${before.section_id}`);
}

export async function moveItem(id: string, dir: -1 | 1) {
  const { supabase } = await requireAdmin();
  await move(supabase, 'items', id, dir);
  changed();
}

export async function setItemFlag(id: string, flag: 'is_hidden' | 'is_unavailable', value: boolean) {
  const { supabase } = await requireAdmin();
  await supabase.from('items').update({ [flag]: value }).eq('id', id);
  changed();
}

export async function deleteItem(id: string) {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from('items').delete().eq('id', id).select('image_path').single();
  await removeImages([data?.image_path]);
  changed();
}
