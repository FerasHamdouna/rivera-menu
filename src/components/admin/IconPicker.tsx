'use client';

import { DynamicIcon, iconNames, type IconName } from 'lucide-react/dynamic';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { inputCls } from './styles';

// Food and cafe icons shown before any search.
const SUGGESTED: IconName[] = [
  'coffee', 'cup-soda', 'milk', 'citrus', 'glass-water', 'wine', 'beer', 'martini', 'bottle-wine',
  'cake-slice', 'cake', 'cookie', 'croissant', 'donut', 'ice-cream-cone', 'ice-cream-bowl', 'dessert', 'candy', 'lollipop', 'popcorn',
  'pizza', 'sandwich', 'hamburger', 'salad', 'soup', 'beef', 'drumstick', 'ham', 'fish', 'egg-fried', 'cooking-pot', 'chef-hat',
  'utensils', 'utensils-crossed', 'flame', 'cherry', 'apple', 'banana', 'grape', 'carrot', 'nut', 'wheat', 'leaf', 'sprout', 'bean',
  'star', 'heart', 'sparkles', 'gift',
];

/** Icon grid with English search over the whole Lucide set; each icon loads on demand. */
export function IconPicker({ value, onChange }: { value: string; onChange: (name: string) => void }) {
  const [q, setQ] = useState('');
  const term = q.trim().toLowerCase();
  const list = term ? iconNames.filter((n) => n.includes(term)).slice(0, 60) : SUGGESTED;

  return (
    <div className="rounded-2xl border border-gold/40 bg-paper p-3">
      <div className="relative mb-3">
        <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث بالإنجليزي: coffee, cake, pizza…" dir="ltr" className={`${inputCls} ps-9 text-start`} />
      </div>
      {list.length ? (
        <div className="grid max-h-64 grid-cols-6 gap-1.5 overflow-y-auto sm:grid-cols-8" role="listbox" aria-label="الأيقونات">
          {list.map((name) => (
            <button
              key={name}
              type="button"
              role="option"
              aria-selected={value === name}
              title={name}
              onClick={() => onChange(name)}
              className={`grid aspect-square place-items-center rounded-xl transition ${value === name ? 'bg-ink text-gold-hi ring-2 ring-gold' : 'text-ink hover:bg-gold/15'}`}
            >
              <DynamicIcon name={name} className="h-6 w-6" strokeWidth={1.6} />
            </button>
          ))}
        </div>
      ) : (
        <p className="py-6 text-center text-sm text-muted">ما في أيقونة بهالاسم</p>
      )}
    </div>
  );
}
