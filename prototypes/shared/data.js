// Rivera menu data, transcribed from the printed menu. Shared by all prototypes.
window.RIVERA = {
  currency: '₪',
  sections: [
    {
      id: 'hot', icon: 'coffee', ar: 'مشروبات ساخنة', en: 'Hot Drinks', hue: 28,
      items: [
        { ar: 'شاي', en: 'Tea', price: 7, dar: 'شاي بالنعناع أو الميرمية', den: 'With mint or sage' },
        { ar: 'شاي كرك', en: 'Karak Tea', price: 10, dar: 'شاي بالحليب والهيل', den: 'Milk tea with cardamom' },
        { ar: 'قهوة', en: 'Coffee', sizes: [{ ar: 'سنجل', en: 'Single', price: 10 }, { ar: 'دبل', en: 'Double', price: 12 }], dar: 'قهوة عربية أو تركية', den: 'Arabic or Turkish' },
        { ar: 'نسكافيه', en: 'Nescafé', price: 10 },
        { ar: 'كابتشينو', en: 'Cappuccino', price: 10, dar: 'إسبريسو مع حليب مرغّى', den: 'Espresso with steamed milk foam' },
        { ar: 'كافي نوتيلا', en: 'Café Nutella', price: 20, dar: 'قهوة بالنوتيلا والكريمة', den: 'Coffee, Nutella & cream' },
        { ar: 'هوت موكا', en: 'Hot Mocha', price: 15 }
      ]
    },
    {
      id: 'shakes', icon: 'milk', ar: 'ميلك شيك', en: 'Milkshakes', hue: 330,
      items: [
        { ar: 'نوتيلا', en: 'Nutella', price: 25 },
        { ar: 'لوتس', en: 'Lotus', price: 25 },
        { ar: 'بستاشيو', en: 'Pistachio', price: 25 },
        { ar: 'بلوبري', en: 'Blueberry', price: 25, available: false }
      ]
    },
    {
      id: 'soft', icon: 'cup-soda', ar: 'مشروبات غازية', en: 'Soft Drinks', hue: 0,
      items: [
        { ar: 'كولا', en: 'Cola', price: 10 },
        { ar: 'سبرايت', en: 'Sprite', price: 10 },
        { ar: 'بلوداي', en: 'Bluday', price: 10 },
        { ar: 'بلو موهيتو', en: 'Blue Mojito', price: 10 },
        { ar: 'XL', en: 'XL Energy', price: 10 }
      ]
    },
    {
      id: 'sweets', icon: 'cake-slice', ar: 'حلويات', en: 'Desserts', hue: 18,
      items: [
        { ar: 'حلا دبي', en: 'Dubai Sweet', price: 20 },
        { ar: 'كيك', en: 'Cake', price: 20, extras: [{ ar: 'لوتس', en: 'Lotus' }, { ar: 'نوتيلا', en: 'Nutella' }, { ar: 'بستاشيو', en: 'Pistachio' }, { ar: 'تشيز', en: 'Cheese' }] },
        { ar: 'سلطانة', en: 'Sultana', sizes: [{ ar: 'صغير', en: 'S', price: 25 }, { ar: 'كبير', en: 'L', price: 35 }] },
        { ar: 'تشيز كيك', en: 'Cheesecake', price: 20, extras: [{ ar: 'لوتس', en: 'Lotus' }, { ar: 'نوتيلا', en: 'Nutella' }, { ar: 'بستاشيو', en: 'Pistachio' }] },
        { ar: 'كيك لندن', en: 'London Cake', price: 25 },
        { ar: 'كنافة ملكية', en: 'Royal Kunafa', price: 25, dar: 'كنافة بالقشطة والفستق', den: 'Cream & pistachio kunafa' },
        { ar: 'كرانشي كلاود', en: 'Crunchy Cloud', sizes: [{ ar: 'صغير', en: 'S', price: 25 }, { ar: 'كبير', en: 'L', price: 35 }] },
        { ar: 'وايت تيراميسو', en: 'White Tiramisu', price: 25 },
        { ar: 'كيك سويس رول', en: 'Swiss Roll', price: 25 },
        { ar: 'كريب', en: 'Crêpe', price: 30, extras: [{ ar: 'لوتس', en: 'Lotus' }, { ar: 'نوتيلا', en: 'Nutella' }, { ar: 'بستاشيو', en: 'Pistachio' }] }
      ]
    },
    {
      id: 'juice', icon: 'citrus', ar: 'عصائر طبيعية', en: 'Fresh Juices', hue: 40,
      items: [
        { ar: 'مانجا', en: 'Mango', price: 20 },
        { ar: 'بطيخ', en: 'Watermelon', price: 20 },
        { ar: 'فراولة', en: 'Strawberry', price: 20 },
        { ar: 'كيوي', en: 'Kiwi', price: 25 },
        { ar: 'ليمون ونعناع', en: 'Lemon & Mint', price: 20 },
        { ar: 'فخفخينة', en: 'Fakhfakhina', price: 25, dar: 'كوكتيل فواكه بالقشطة', den: 'Fruit cocktail with cream' },
        { ar: 'ليمون وكيوي', en: 'Lemon & Kiwi', price: 20 },
        { ar: 'موهيتو', en: 'Mojito', price: 20, extras: [{ ar: 'بطيخ', en: 'Watermelon' }, { ar: 'أناناس', en: 'Pineapple' }, { ar: 'توت', en: 'Berry' }] },
        { ar: 'فراولة وحليب', en: 'Strawberry Milk', price: 25 },
        { ar: 'أفوكادو', en: 'Avocado', price: 25, dar: 'بالعسل والمكسرات', den: 'With honey & nuts' }
      ]
    },
    {
      id: 'cold', icon: 'glass-water', ar: 'مشروبات باردة', en: 'Iced Drinks', hue: 200,
      items: [
        { ar: 'آيس كوفي', en: 'Iced Coffee', price: 15 },
        { ar: 'آيس موكا', en: 'Iced Mocha', price: 15 },
        { ar: 'آيس كراميل ميكاتو', en: 'Iced Caramel Macchiato', price: 20 },
        { ar: 'مياه صغيرة', en: 'Small Water', price: 5 }
      ]
    },
    {
      id: 'shisha', icon: 'flame', ar: 'الأراجيل', en: 'Shisha', hue: 280,
      items: [
        { ar: 'فاخر إماراتي', en: 'Fakher Emirati' },
        { ar: 'فاخر مصري', en: 'Fakher Egyptian' },
        { ar: 'خدمة أرجيلة', en: 'Shisha Service' }
      ]
    }
  ]
};

// Helpers shared by the prototypes.
(function (R) {
  R.lang = 'ar';
  R.t = (o, k) => (R.lang === 'ar' ? o[k ? k + 'ar' : 'ar'] || o[k ? k + 'en' : 'en'] : o[k ? k + 'en' : 'en'] || o[k ? k + 'ar' : 'ar']) || '';
  R.desc = (it) => (R.lang === 'ar' ? it.dar : it.den) || '';
  R.isOut = (it) => it.available === false;
  // Short price label: "25", "S 25 · L 35", or an "ask" label when no price is set.
  R.price = (it) => {
    if (it.sizes) return it.sizes.map((s) => `${R.lang === 'ar' ? s.ar : s.en} ${s.price}`).join(' · ');
    if (it.price == null) return R.lang === 'ar' ? 'حسب الطلب' : 'Ask us';
    return String(it.price);
  };
  R.ui = {
    ar: { menu: 'المينيو', tagline: 'لحظاتك تستحق التميز', out: 'غير متوفر', sizes: 'الأحجام', flavors: 'النكهات', open: 'افتح المينيو', items: 'صنف', back: 'رجوع', swipe: 'اسحب للتقليب' },
    en: { menu: 'Menu', tagline: 'Your moments deserve excellence', out: 'Unavailable', sizes: 'Sizes', flavors: 'Flavors', open: 'Open the menu', items: 'items', back: 'Back', swipe: 'Swipe to turn' }
  };
  R.s = (k) => R.ui[R.lang][k];
  R.setLang = (l) => {
    R.lang = l;
    document.documentElement.lang = l;
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
  };
  // Placeholder "photo" until the admin uploads real images: tinted plate + gold line icon.
  R.art = (sec, it, i) => {
    const h = sec.hue, a = (i * 47) % 360;
    return `<div class="art" style="--h:${h};--a:${a}deg"><i data-lucide="${sec.icon}"></i></div>`;
  };
  R.icons = () => window.lucide && lucide.createIcons();
})(window.RIVERA);
