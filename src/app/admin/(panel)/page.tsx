import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { deleteSection, moveSection, setSectionHidden } from '@/app/admin/actions/menu';
import { Loading, PageTitle } from '@/components/admin/Loading';
import { DeleteButton, HideButton, MoveButtons } from '@/components/admin/RowControls';
import { btnCls } from '@/components/admin/styles';
import { SectionIcon } from '@/components/SectionIcon';
import { requireAdmin } from '@/lib/admin/auth';
import { getMenu } from '@/lib/menu';

async function Sections() {
  await requireAdmin();
  const { sections } = await getMenu();
  if (!sections.length) return <p className="rounded-2xl bg-paper p-6 text-center text-muted">ما في أقسام لسا. ابدأ بإضافة أول قسم.</p>;

  return (
    <ul className="space-y-2.5">
      {sections.map((s, i) => (
        <li key={s.id} className={`flex items-center gap-2 rounded-2xl border border-gold/30 bg-paper p-2 pe-1 ${s.is_hidden ? 'opacity-60' : ''}`}>
          <MoveButtons up={moveSection.bind(null, s.id, -1)} down={moveSection.bind(null, s.id, 1)} first={i === 0} last={i === sections.length - 1} />
          <Link href={`/admin/sections/${s.id}`} className="flex min-w-0 flex-1 items-center gap-3 py-1">
            <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-ink text-gold-hi"><SectionIcon name={s.icon} className="h-5 w-5" /></span>
            <span className="min-w-0">
              <span className="block truncate font-bold">{s.name_ar}</span>
              <span className="block truncate text-xs text-muted">
                {s.items.length} صنف{s.name_en ? ` · ${s.name_en}` : ''}{s.is_hidden ? ' · مخفي' : ''}
              </span>
            </span>
          </Link>
          <HideButton hidden={s.is_hidden} action={setSectionHidden.bind(null, s.id, !s.is_hidden)} />
          <DeleteButton action={deleteSection.bind(null, s.id)} confirm={`حذف قسم "${s.name_ar}" مع كل أصنافه (${s.items.length})؟ ما في رجعة.`} />
        </li>
      ))}
    </ul>
  );
}

export default function SectionsPage() {
  return (
    <>
      <PageTitle action={<Link href="/admin/sections/new" className={btnCls('gold')}><Plus className="h-4 w-4" />قسم جديد</Link>}>الأقسام</PageTitle>
      <Suspense fallback={<Loading />}>
        <Sections />
      </Suspense>
    </>
  );
}
