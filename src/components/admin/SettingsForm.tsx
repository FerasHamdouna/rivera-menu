'use client';

import { ImagePlus, Plus, Trash2, X } from 'lucide-react';
import { useActionState, useRef, useState } from 'react';
import { updateSettings, type SettingsPayload } from '@/app/admin/actions/settings';
import type { Settings } from '@/lib/types';
import { Crown } from '@/components/menu/ornaments';
import { btnCls, inputCls } from './styles';
import { Field, Input, Notice, SubmitButton } from './ui';
import { canvasToBlob, loadImage, publicUrl, uploadImage } from './upload';

const LOGO_MAX = 600; // px on the longest side

/** Shrinks raster logos to ≤600px WebP (keeps transparency); SVG goes up untouched. */
async function prepareLogo(file: File): Promise<Blob> {
  if (file.type === 'image/svg+xml') return file;
  const img = await loadImage(file);
  const k = Math.min(1, LOGO_MAX / Math.max(img.width, img.height));
  const c = document.createElement('canvas');
  c.width = Math.round(img.width * k);
  c.height = Math.round(img.height * k);
  c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
  URL.revokeObjectURL(img.src);
  return canvasToBlob(c, 0.9);
}

export function SettingsForm({ settings }: { settings: Settings }) {
  const [state, formAction] = useActionState(updateSettings, null);
  const [v, setV] = useState<SettingsPayload>({
    logo_path: settings.logo_path,
    phone: settings.phone,
    address: settings.address,
    hours_text: settings.hours_text,
    instagram_url: settings.instagram_url ?? '',
    facebook_url: settings.facebook_url ?? '',
    extra_links: settings.extra_links ?? [],
  });
  const set = <K extends keyof SettingsPayload>(k: K, val: SettingsPayload[K]) => setV((p) => ({ ...p, [k]: val }));
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [logoError, setLogoError] = useState('');

  const pickLogo = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    setLogoError('');
    try {
      set('logo_path', await uploadImage('logo', await prepareLogo(file)));
    } catch {
      setLogoError('ما انرفع الشعار. جرّب صورة PNG أو SVG.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="data" value={JSON.stringify(v)} />

      <fieldset className="rounded-2xl border border-gold/30 bg-paper p-4">
        <legend className="px-1 text-sm font-bold">الشعار</legend>
        <div className="flex flex-wrap items-center gap-4">
          <div className="grid h-24 w-40 place-items-center rounded-xl border border-gold/30 bg-cream p-2">
            {v.logo_path ? (
              // eslint-disable-next-line @next/next/no-img-element -- uploaded logo preview
              <img src={publicUrl(v.logo_path)} alt="الشعار" className="max-h-full max-w-full object-contain" />
            ) : (
              <div className="text-center leading-none text-gold-lo" dir="ltr">
                <Crown className="mx-auto h-5 w-8 text-gold" />
                <span className="font-[family-name:var(--font-vibes)] text-3xl">Rivera</span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <button type="button" disabled={uploading} onClick={() => fileRef.current?.click()} className={btnCls('ghost')}><ImagePlus className="h-4 w-4" />{uploading ? 'جاري الرفع…' : v.logo_path ? 'غيّر الشعار' : 'ارفع شعار'}</button>
            {v.logo_path && <button type="button" onClick={() => set('logo_path', null)} className={btnCls('danger')}><Trash2 className="h-4 w-4" />رجّع الشعار المرسوم</button>}
          </div>
          <input ref={fileRef} type="file" accept="image/png,image/svg+xml,image/webp,image/jpeg" hidden onChange={(e) => { pickLogo(e.target.files?.[0]); e.target.value = ''; }} />
        </div>
        <p className="mt-2 text-xs text-muted">الأفضل PNG بخلفية شفافة أو SVG. بيظهر أعلى المينيو.</p>
        {logoError && <p className="mt-2 text-sm text-red-800">{logoError}</p>}
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="رقم التلفون"><Input value={v.phone} onChange={(e) => set('phone', e.target.value)} type="tel" dir="ltr" /></Field>
        <Field label="العنوان"><Input value={v.address} onChange={(e) => set('address', e.target.value)} /></Field>
        <Field label="ساعات الدوام"><Input value={v.hours_text} onChange={(e) => set('hours_text', e.target.value)} /></Field>
        <Field label="رابط إنستغرام" hint="فاضي = ما بيظهر"><Input value={v.instagram_url} onChange={(e) => set('instagram_url', e.target.value)} dir="ltr" placeholder="https://instagram.com/…" /></Field>
        <Field label="رابط فيسبوك" hint="فاضي = ما بيظهر"><Input value={v.facebook_url} onChange={(e) => set('facebook_url', e.target.value)} dir="ltr" placeholder="https://facebook.com/…" /></Field>
      </div>

      <fieldset className="rounded-2xl border border-gold/30 bg-paper p-4">
        <legend className="px-1 text-sm font-bold">روابط إضافية</legend>
        <p className="mb-3 text-xs text-muted">اختياري: واتساب، تيك توك، خرائط جوجل…</p>
        <div className="space-y-2">
          {v.extra_links.map((l, i) => {
            const upd = (patch: Partial<typeof l>) => set('extra_links', v.extra_links.map((x, j) => (j === i ? { ...x, ...patch } : x)));
            return (
              <div key={i} className="flex items-center gap-2">
                <input value={l.label} onChange={(e) => upd({ label: e.target.value })} placeholder="واتساب" aria-label="اسم الرابط" className={`${inputCls} min-w-0 flex-1`} />
                <input value={l.url} onChange={(e) => upd({ url: e.target.value })} placeholder="https://wa.me/…" dir="ltr" aria-label="الرابط" className={`${inputCls} min-w-0 flex-[2]`} />
                <button type="button" onClick={() => set('extra_links', v.extra_links.filter((_, j) => j !== i))} aria-label="شيل" className="grid h-10 w-10 flex-none place-items-center rounded-lg text-red-800 hover:bg-red-50"><X className="h-4 w-4" /></button>
              </div>
            );
          })}
        </div>
        <button type="button" onClick={() => set('extra_links', [...v.extra_links, { label: '', url: '' }])} className={`${btnCls('ghost')} mt-3 py-2`}><Plus className="h-4 w-4" />أضف رابط</button>
      </fieldset>

      <Notice state={state} />
      <SubmitButton className="w-full py-3">احفظ الإعدادات</SubmitButton>
    </form>
  );
}
