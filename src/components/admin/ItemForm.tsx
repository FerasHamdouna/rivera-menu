'use client';

import { Plus, X } from 'lucide-react';
import { useActionState, useState } from 'react';
import type { FormState } from '@/app/admin/actions/auth';
import type { ItemPayload } from '@/app/admin/actions/menu';
import type { MenuItem } from '@/lib/types';
import { ImageField } from './ImageField';
import { btnCls, inputCls } from './styles';
import { Field, Input, Notice, SubmitButton, Textarea } from './ui';

type Action = (state: FormState, fd: FormData) => Promise<FormState>;

// One tap fills the size names; the admin only types the prices.
const SIZE_PRESETS = [
  { label: 'صغير / كبير', sizes: [{ name_ar: 'صغير', name_en: 'S' }, { name_ar: 'كبير', name_en: 'L' }] },
  { label: 'صغير / وسط / كبير', sizes: [{ name_ar: 'صغير', name_en: 'S' }, { name_ar: 'وسط', name_en: 'M' }, { name_ar: 'كبير', name_en: 'L' }] },
  { label: 'سنجل / دبل', sizes: [{ name_ar: 'سنجل', name_en: 'Single' }, { name_ar: 'دبل', name_en: 'Double' }] },
];

const fromItem = (it?: MenuItem): ItemPayload => ({
  name_ar: it?.name_ar ?? '',
  name_en: it?.name_en ?? '',
  desc_ar: it?.desc_ar ?? '',
  desc_en: it?.desc_en ?? '',
  price: it?.price != null ? String(it.price) : '',
  image_path: it?.image_path ?? null,
  sizes: it?.sizes.map((s) => ({ name_ar: s.name_ar, name_en: s.name_en ?? '', price: String(s.price) })) ?? [],
  flavors: it?.flavors.map((f) => ({ name_ar: f.name_ar, name_en: f.name_en ?? '' })) ?? [],
});

function Group({ title, hint, children, onAdd, addLabel }: { title: string; hint: string; children: React.ReactNode; onAdd: () => void; addLabel: string }) {
  return (
    <fieldset className="rounded-2xl border border-gold/30 bg-paper p-4">
      <legend className="px-1 text-sm font-bold">{title}</legend>
      <p className="mb-3 text-xs text-muted">{hint}</p>
      <div className="space-y-2">{children}</div>
      <button type="button" onClick={onAdd} className={`${btnCls('ghost')} mt-3 py-2`}><Plus className="h-4 w-4" />{addLabel}</button>
    </fieldset>
  );
}

function RemoveRow({ onClick }: { onClick: () => void }) {
  return <button type="button" onClick={onClick} aria-label="شيل" className="grid h-10 w-10 flex-none place-items-center rounded-lg text-red-800 hover:bg-red-50"><X className="h-4 w-4" /></button>;
}

export function ItemForm({ action, item }: { action: Action; item?: MenuItem }) {
  const [state, formAction] = useActionState(action, null);
  const [v, setV] = useState<ItemPayload>(() => fromItem(item));
  const set = <K extends keyof ItemPayload>(k: K, val: ItemPayload[K]) => setV((p) => ({ ...p, [k]: val }));
  const hasSizes = v.sizes.length > 0;

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="data" value={JSON.stringify(v)} />

      <ImageField value={v.image_path} onChange={(p) => set('image_path', p)} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="الاسم بالعربي"><Input value={v.name_ar} onChange={(e) => set('name_ar', e.target.value)} required placeholder="كابتشينو" /></Field>
        <Field label="الاسم بالإنجليزي" hint="اختياري"><Input value={v.name_en} onChange={(e) => set('name_en', e.target.value)} dir="ltr" placeholder="Cappuccino" /></Field>
        <Field label="الوصف بالعربي" hint="اختياري، سطر أو سطرين"><Textarea value={v.desc_ar} onChange={(e) => set('desc_ar', e.target.value)} /></Field>
        <Field label="الوصف بالإنجليزي" hint="اختياري"><Textarea value={v.desc_en} onChange={(e) => set('desc_en', e.target.value)} dir="ltr" /></Field>
      </div>

      {!hasSizes && (
        <Field label="السعر (₪)" hint="خلّيه فاضي إذا السعر حسب الطلب">
          <Input value={v.price} onChange={(e) => set('price', e.target.value)} inputMode="decimal" dir="ltr" className="max-w-40" placeholder="15" />
        </Field>
      )}

      <Group
        title="الأحجام"
        hint={hasSizes ? 'كل سطر = حجم واحد: اسمه، وبعدين سعره. لما يكون في أحجام، السعر بيطلع منها.' : 'اختياري: إذا الصنف إله أكثر من حجم، اختار من تحت أو أضف حجم، وكل حجم بسعره.'}
        addLabel="أضف حجم"
        onAdd={() => set('sizes', [...v.sizes, { name_ar: '', name_en: '', price: '' }])}
      >
        <div className="flex flex-wrap gap-1.5">
          {SIZE_PRESETS.map((preset) => (
            <button key={preset.label} type="button" onClick={() => set('sizes', preset.sizes.map((z) => ({ ...z, price: '' })))} className="rounded-full border border-gold/50 px-3 py-1 text-xs text-gold-lo hover:bg-gold/10">
              {preset.label}
            </button>
          ))}
        </div>
        {hasSizes && (
          <div className="flex gap-2 px-0.5 text-[11px] font-bold text-muted">
            <span className="flex-[2]">اسم الحجم</span>
            <span className="flex-[1.4]">بالإنجليزي</span>
            <span className="flex-1">السعر ₪</span>
            <span className="w-10 flex-none" />
          </div>
        )}
        {v.sizes.map((s, i) => {
          const upd = (patch: Partial<typeof s>) => set('sizes', v.sizes.map((x, j) => (j === i ? { ...x, ...patch } : x)));
          return (
            <div key={i} className="flex items-center gap-2">
              <input value={s.name_ar} onChange={(e) => upd({ name_ar: e.target.value })} placeholder="صغير" aria-label="اسم الحجم بالعربي" className={`${inputCls} min-w-0 flex-[2]`} />
              <input value={s.name_en} onChange={(e) => upd({ name_en: e.target.value })} placeholder="S" dir="ltr" aria-label="اسم الحجم بالإنجليزي" className={`${inputCls} min-w-0 flex-[1.4]`} />
              <input value={s.price} onChange={(e) => upd({ price: e.target.value })} placeholder="25" inputMode="decimal" dir="ltr" aria-label="السعر" className={`${inputCls} min-w-0 flex-1 font-bold`} />
              <RemoveRow onClick={() => set('sizes', v.sizes.filter((_, j) => j !== i))} />
            </div>
          );
        })}
      </Group>

      <Group title="النكهات" hint="اختياري: خيارات بدون سعر إضافي (لوتس، نوتيلا، بستاشيو…)." addLabel="أضف نكهة" onAdd={() => set('flavors', [...v.flavors, { name_ar: '', name_en: '' }])}>
        {v.flavors.map((f, i) => {
          const upd = (patch: Partial<typeof f>) => set('flavors', v.flavors.map((x, j) => (j === i ? { ...x, ...patch } : x)));
          return (
            <div key={i} className="flex items-center gap-2">
              <input value={f.name_ar} onChange={(e) => upd({ name_ar: e.target.value })} placeholder="لوتس" aria-label="النكهة بالعربي" className={`${inputCls} min-w-0 flex-1`} />
              <input value={f.name_en} onChange={(e) => upd({ name_en: e.target.value })} placeholder="Lotus" dir="ltr" aria-label="النكهة بالإنجليزي" className={`${inputCls} min-w-0 flex-1`} />
              <RemoveRow onClick={() => set('flavors', v.flavors.filter((_, j) => j !== i))} />
            </div>
          );
        })}
      </Group>

      <Notice state={state} />
      <div className="sticky bottom-3 z-10">
        <SubmitButton className="w-full py-3 shadow-xl">{item ? 'احفظ الصنف' : 'أضف الصنف'}</SubmitButton>
      </div>
    </form>
  );
}
