import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { cacheLife, cacheTag } from 'next/cache';
import type { Menu, MenuSection, Settings } from './types';
import { supabaseAnonKey, supabaseUrl } from './supabase/env';

/** Cache tag for everything the public menu shows. Admin writes call updateTag(MENU_TAG). */
export const MENU_TAG = 'menu';

const byOrder = (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order;

/**
 * The menu as a visitor sees it. Uses a cookie-less anon client so the result can be
 * cached and shared by every visitor; RLS already drops hidden sections and items.
 */
export async function getPublicMenu(): Promise<Menu> {
  'use cache';
  cacheTag(MENU_TAG);
  // Short fallback so edits made straight in the Supabase dashboard still show up.
  cacheLife('minutes');

  const supabase = createClient(supabaseUrl(), supabaseAnonKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const [settingsRes, sectionsRes] = await Promise.all([
    supabase.from('settings').select('*').single(),
    supabase.from('sections').select('*, items(*, sizes:item_sizes(*), flavors:item_flavors(*))').order('sort_order'),
  ]);
  if (settingsRes.error) throw settingsRes.error;
  if (sectionsRes.error) throw sectionsRes.error;

  const sections = (sectionsRes.data as MenuSection[]).map((s) => ({
    ...s,
    items: s.items.sort(byOrder).map((it) => ({
      ...it,
      // numeric columns arrive as strings or numbers depending on the driver
      price: it.price == null ? null : Number(it.price),
      sizes: it.sizes.sort(byOrder).map((z) => ({ ...z, price: Number(z.price) })),
      flavors: it.flavors.sort(byOrder),
    })),
  }));
  return { settings: settingsRes.data as Settings, sections };
}
