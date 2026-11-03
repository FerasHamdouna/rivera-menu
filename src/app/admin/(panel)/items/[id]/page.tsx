import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { updateItem } from '@/app/admin/actions/menu';
import { ItemForm } from '@/components/admin/ItemForm';
import { Loading } from '@/components/admin/Loading';
import { requireAdmin } from '@/lib/admin/auth';
import { getMenu } from '@/lib/menu';

async function Form({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireAdmin();
  const { sections } = await getMenu();
  const section = sections.find((s) => s.items.some((it) => it.id === id));
  const item = section?.items.find((it) => it.id === id);
  if (!section || !item) notFound();
  return (
    <>
      <Link href={`/admin/sections/${section.id}`} className="mb-3 inline-flex items-center gap-1 text-sm text-gold-lo"><ArrowRight className="h-4 w-4" />{section.name_ar}</Link>
      <h1 className="mb-4 font-display text-2xl font-bold">تعديل: {item.name_ar}</h1>
      <ItemForm action={updateItem.bind(null, id)} item={item} />
    </>
  );
}

export default function EditItemPage({ params }: PageProps<'/admin/items/[id]'>) {
  return (
    <Suspense fallback={<Loading />}>
      <Form params={params} />
    </Suspense>
  );
}
