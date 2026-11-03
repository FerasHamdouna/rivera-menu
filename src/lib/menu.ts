import 'server-only';
import type { Menu, MenuSection, Settings } from './types';
import { createClient } from './supabase/server';

const byOrder = (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order;

/**
 * Loads the whole menu in one query. Under the public role RLS already drops hidden
 * sections and items; for the admin everything comes back, hidden included.
 */
export async function getMenu(): Promise<Menu> {
  const supabase = await createClient();
  const [settingsRes, sectionsRes] = await Promise.all([
    supabase.from('settings').select('*').single(),
    supabase.from('sections').select('*, items(*, sizes:item_sizes(*), flavors:item_flavors(*))').order('sort_order'),
  ]);
  if (settingsRes.error) throw settingsRes.error;
  if (sectionsRes.error) throw sectionsRes.error;

  const sections = (sectionsRes.data as MenuSection[]).map((s) => ({
    ...s,
    items: s.items.sort(byOrder).map((it) => ({ ...it, sizes: it.sizes.sort(byOrder), flavors: it.flavors.sort(byOrder) })),
  }));
  return { settings: settingsRes.data as Settings, sections };
}

