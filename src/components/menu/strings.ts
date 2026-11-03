export type Lang = 'ar' | 'en';
export type View = 'list' | 'grid';

/** Developer credit shown at the very bottom of the menu. */
export const CREDIT_WHATSAPP = { display: '+972 59 767 3571', link: 'https://wa.me/972597673571' };

export const STRINGS = {
  ar: { search: 'ابحث عن صنف…', list: 'قائمة', grid: 'صور', out: 'غير متوفر', ask: 'حسب الطلب', from: 'من', sizes: 'الأحجام', flavors: 'النكهات', empty: 'ما في نتائج', close: 'إغلاق', madeBy: 'تم الإنشاء بواسطة', author: 'فراس رائد حمدونه' },
  en: { search: 'Search the menu…', list: 'List', grid: 'Photos', out: 'Unavailable', ask: 'Ask us', from: 'from', sizes: 'Sizes', flavors: 'Flavors', empty: 'No matches', close: 'Close', madeBy: 'Made by', author: 'Feras Raid Hamdouna' },
} as const;

/** Name in the chosen language, falling back to Arabic when there is no English. */
export const pick = (o: { name_ar: string; name_en: string | null }, lang: Lang) => (lang === 'en' && o.name_en ? o.name_en : o.name_ar);
/** The name in the other language, shown small under the main one. */
export const other = (o: { name_ar: string; name_en: string | null }, lang: Lang) => (lang === 'en' ? o.name_ar : o.name_en);
export const describe = (o: { desc_ar: string | null; desc_en: string | null }, lang: Lang) => (lang === 'en' ? o.desc_en || o.desc_ar : o.desc_ar || o.desc_en);
