import { ArrowRight, ImageOff, Pencil, Plus } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { deleteItem, moveItem, setItemFlag, updateSection } from '@/app/admin/actions/menu';
import { Loading } from '@/components/admin/Loading';
import { DeleteButton, HideButton, MoveButtons, UnavailableButton } from '@/components/admin/RowControls';
import { SectionForm } from '@/components/admin/SectionForm';
import { btnCls } from '@/components/admin/styles';
import { SectionIcon } from '@/components/SectionIcon';
import { requireAdmin } from '@/lib/admin/auth';
import { imageUrl } from '@/lib/images';
import { getMenu } from '@/lib/menu';
import type { MenuItem } from '@/lib/types';

function PriceLabel({ it }: { it: MenuItem }) {
  if (!it.sizes.length) return <>{it.price == null ? 'حسب الطلب' : `${it.price} ₪`}</>;
  // Isolated per size so "صغير 25" never gets reordered next to the following size
  return <>{it.sizes.map((s) => <span key={s.id} className="me-2 inline-block [unicode-bidi:isolate]">{s.name_ar} {s.price}</span>)}</>;
}

async function Section({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireAdmin();
  const { sections } = await getMenu();
  const section = sections.find((s) => s.id === id);
  if (!section) notFound();
  const items = section.items;

  return (
    <>
      <div className="mb-4 flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-ink text-gold-hi"><SectionIcon name={section.icon} className="h-6 w-6" /></span>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-2xl font-bold">{section.name_ar}</h1>
          <p className="text-xs text-muted">{items.length} صنف{section.is_hidden ? ' · القسم مخفي عن الزبائن' : ''}</p>
        </div>
        <Link href={`/admin/sections/${id}/items/new`} className={btnCls('gold')}><Plus className="h-4 w-4" />صنف</Link>
      </div>

      <details className="group mb-5 rounded-2xl border border-gold/30 bg-paper">
        <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-bold text-gold-lo">
          <Pencil className="h-4 w-4" />تعديل اسم القسم وأيقونته
        </summary>
        <div className="border-t border-gold/20 p-4"><SectionForm action={updateSection.bind(null, id)} section={section} /></div>
      </details>

      {!items.length && <p className="rounded-2xl bg-paper p-6 text-center text-muted">ما في أصناف بهالقسم لسا.</p>}
      <ul className="space-y-2.5">
        {items.map((it, i) => {
          const img = imageUrl(it.image_path);
          return (
            <li key={it.id} className={`rounded-2xl border border-gold/30 bg-paper p-2 pe-1 ${it.is_hidden ? 'opacity-55' : ''}`}>
              <div className="flex items-center gap-2">
                <MoveButtons up={moveItem.bind(null, it.id, -1)} down={moveItem.bind(null, it.id, 1)} first={i === 0} last={i === items.length - 1} />
                <Link href={`/admin/items/${it.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="grid h-12 w-12 flex-none place-items-center overflow-hidden rounded-xl bg-ink/90 text-gold-hi/60">
                    {/* eslint-disable-next-line @next/next/no-img-element -- small thumbnail of an uploaded WebP */}
                    {img ? <img src={img} alt="" className="h-full w-full object-cover" /> : <ImageOff className="h-5 w-5" />}
                  </span>
                  <span className="min-w-0">
                    <span className={`block truncate font-bold ${it.is_unavailable ? 'line-through decoration-red-700' : ''}`}>{it.name_ar}</span>
                    <span className="block truncate text-xs text-gold-lo"><PriceLabel it={it} /></span>
                    {(it.is_hidden || it.is_unavailable) && (
                      <span className="mt-0.5 flex gap-1">
                        {it.is_hidden && <span className="rounded-full bg-ink/10 px-2 text-[11px]">مخفي</span>}
                        {it.is_unavailable && <span className="rounded-full bg-red-100 px-2 text-[11px] text-red-800">غير متوفر</span>}
                      </span>
                    )}
                  </span>
                </Link>
              </div>
              <div className="mt-1 flex justify-end gap-0.5 border-t border-gold/15 pt-1">
                <UnavailableButton out={it.is_unavailable} action={setItemFlag.bind(null, it.id, 'is_unavailable', !it.is_unavailable)} />
                <HideButton hidden={it.is_hidden} action={setItemFlag.bind(null, it.id, 'is_hidden', !it.is_hidden)} />
                <Link href={`/admin/items/${it.id}`} aria-label="تعديل" title="تعديل" className="grid h-9 w-9 place-items-center rounded-lg text-gold-lo hover:bg-gold/15"><Pencil className="h-[18px] w-[18px]" /></Link>
                <DeleteButton action={deleteItem.bind(null, it.id)} confirm={`حذف "${it.name_ar}"؟`} />
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default function SectionPage({ params }: PageProps<'/admin/sections/[id]'>) {
  return (
    <>
      <Link href="/admin" className="mb-3 inline-flex items-center gap-1 text-sm text-gold-lo"><ArrowRight className="h-4 w-4" />كل الأقسام</Link>
      <Suspense fallback={<Loading />}>
        <Section params={params} />
      </Suspense>
    </>
  );
}
