// Row shapes of the Supabase tables (see supabase/migrations).

export type Settings = {
  logo_path: string | null;
  phone: string;
  address: string;
  hours_text: string;
  instagram_url: string | null;
  facebook_url: string | null;
  extra_links: { label: string; url: string }[];
};

export type Section = {
  id: string;
  name_ar: string;
  name_en: string | null;
  icon: string;
  sort_order: number;
  is_hidden: boolean;
};

export type ItemSize = {
  id: string;
  item_id: string;
  name_ar: string;
  name_en: string | null;
  price: number;
  sort_order: number;
};

export type ItemFlavor = {
  id: string;
  item_id: string;
  name_ar: string;
  name_en: string | null;
  sort_order: number;
};

export type Item = {
  id: string;
  section_id: string;
  name_ar: string;
  name_en: string | null;
  desc_ar: string | null;
  desc_en: string | null;
  /** null means "حسب الطلب"; ignored when the item has sizes. */
  price: number | null;
  image_path: string | null;
  sort_order: number;
  is_hidden: boolean;
  is_unavailable: boolean;
};

export type MenuItem = Item & { sizes: ItemSize[]; flavors: ItemFlavor[] };
export type MenuSection = Section & { items: MenuItem[] };
export type Menu = { settings: Settings; sections: MenuSection[] };
