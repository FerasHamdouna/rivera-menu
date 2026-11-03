import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { createItem } from '@/app/admin/actions/menu';
import { ItemForm } from '@/components/admin/ItemForm';
import { Loading } from '@/components/admin/Loading';
import { requireAdmin } from '@/lib/admin/auth';

async function Form({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const { data: section } = await supabase.from('sections').select('id, name_ar').eq('id', id).maybeSingle();
  if (!section) notFound();
  return (
    <>
      <Link href={`/admin/sections/${id}`} className="mb-3 inline-flex items-center gap-1 text-sm text-gold-lo"><ArrowRight className="h-4 w-4" />{section.name_ar}</Link>
      <h1 className="mb-4 font-display text-2xl font-bold">صنف جديد</h1>
      <ItemForm action={createItem.bind(null, id)} />
    </>
  );
}

export default function NewItemPage({ params }: PageProps<'/admin/sections/[id]/items/new'>) {
  return (
    <Suspense fallback={<Loading />}>
      <Form params={params} />
    </Suspense>
  );
}
