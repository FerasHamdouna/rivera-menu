'use client';

import { ImagePlus, Trash2, ZoomIn } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { btnCls } from './styles';
import { canvasToBlob, loadImage, publicUrl, uploadImage } from './upload';

const VIEW = 288; // on-screen crop square, px
const OUT = 800; // saved image size, px

type Crop = { img: HTMLImageElement; zoom: number; x: number; y: number };

/** Draws the image into a square canvas: `zoom` 1 = cover, x/y = offset of the image centre in view px. */
function draw(ctx: CanvasRenderingContext2D, size: number, c: Crop) {
  const k = size / VIEW;
  const base = Math.max(VIEW / c.img.width, VIEW / c.img.height) * c.zoom * k;
  const w = c.img.width * base, h = c.img.height * base;
  ctx.fillStyle = '#f7f0ea';
  ctx.fillRect(0, 0, size, size);
  ctx.drawImage(c.img, size / 2 - w / 2 + c.x * k, size / 2 - h / 2 + c.y * k, w, h);
}

/** Keeps the image covering the whole square while panning. */
function clamp(c: Crop): Crop {
  const base = Math.max(VIEW / c.img.width, VIEW / c.img.height) * c.zoom;
  const mx = Math.max(0, (c.img.width * base - VIEW) / 2), my = Math.max(0, (c.img.height * base - VIEW) / 2);
  return { ...c, x: Math.max(-mx, Math.min(mx, c.x)), y: Math.max(-my, Math.min(my, c.y)) };
}

/** Item photo: pick from camera/gallery, crop square, shrink to 800px WebP in the browser, then upload. */
export function ImageField({ value, onChange }: { value: string | null; onChange: (path: string | null) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [crop, setCrop] = useState<Crop | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const drag = useRef<{ px: number; py: number; x: number; y: number } | null>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (crop && ctx) draw(ctx, VIEW * 2, crop);
  }, [crop]);

  const pick = async (file?: File) => {
    if (!file) return;
    setError('');
    try {
      setCrop({ img: await loadImage(file), zoom: 1, x: 0, y: 0 });
    } catch {
      setError('الملف مش صورة');
    }
  };

  const confirm = async () => {
    if (!crop) return;
    setBusy(true);
    setError('');
    try {
      const out = document.createElement('canvas');
      out.width = out.height = OUT;
      draw(out.getContext('2d')!, OUT, crop);
      onChange(await uploadImage('items', await canvasToBlob(out)));
      URL.revokeObjectURL(crop.img.src);
      setCrop(null);
    } catch {
      setError('ما انرفعت الصورة. تأكد من النت وجرّب مرة ثانية.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="grid h-24 w-24 flex-none place-items-center overflow-hidden rounded-2xl border border-gold/40 bg-ink/90 text-gold-hi/50">
          {/* eslint-disable-next-line @next/next/no-img-element -- preview of the uploaded file */}
          {value ? <img src={publicUrl(value)} alt="" className="h-full w-full object-cover" /> : <ImagePlus className="h-7 w-7" />}
        </div>
        <div className="flex flex-col gap-2">
          <button type="button" onClick={() => fileRef.current?.click()} className={btnCls('ghost')}><ImagePlus className="h-4 w-4" />{value ? 'غيّر الصورة' : 'اختار صورة'}</button>
          {value && <button type="button" onClick={() => onChange(null)} className={btnCls('danger')}><Trash2 className="h-4 w-4" />شيل الصورة</button>}
        </div>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ''; }} />
      </div>
      {error && !crop && <p className="mt-2 text-sm text-red-800">{error}</p>}

      {crop && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-sm rounded-3xl bg-cream p-5">
            <h2 className="mb-1 font-display text-xl font-bold">قص الصورة</h2>
            <p className="mb-3 text-sm text-muted">اسحب الصورة لتحرّكها، وكبّرها من الشريط.</p>
            <canvas
              ref={canvasRef}
              width={VIEW * 2}
              height={VIEW * 2}
              style={{ width: VIEW, height: VIEW, touchAction: 'none' }}
              className="mx-auto block cursor-grab rounded-2xl ring-2 ring-gold active:cursor-grabbing"
              onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); drag.current = { px: e.clientX, py: e.clientY, x: crop.x, y: crop.y }; }}
              onPointerMove={(e) => { const d = drag.current; if (d) setCrop(clamp({ ...crop, x: d.x + e.clientX - d.px, y: d.y + e.clientY - d.py })); }}
              onPointerUp={() => { drag.current = null; }}
            />
            <label className="mt-4 flex items-center gap-3">
              <ZoomIn className="h-5 w-5 text-gold-lo" />
              <input type="range" min={1} max={3} step={0.01} value={crop.zoom} onChange={(e) => setCrop(clamp({ ...crop, zoom: Number(e.target.value) }))} className="flex-1 accent-[#8a5b38]" aria-label="تكبير" />
            </label>
            {error && <p className="mt-2 text-sm text-red-800">{error}</p>}
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={confirm} disabled={busy} className={`${btnCls('primary')} flex-1`}>{busy ? 'جاري الرفع…' : 'استخدم الصورة'}</button>
              <button type="button" onClick={() => { URL.revokeObjectURL(crop.img.src); setCrop(null); }} disabled={busy} className={btnCls('ghost')}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
