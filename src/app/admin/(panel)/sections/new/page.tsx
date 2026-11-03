import { Suspense } from 'react';
import { createSection } from '@/app/admin/actions/menu';
import { Loading, PageTitle } from '@/components/admin/Loading';
import { SectionForm } from '@/components/admin/SectionForm';
import { requireAdmin } from '@/lib/admin/auth';

async function Form() {
  await requireAdmin();
  return <SectionForm action={createSection} />;
}

export default function NewSectionPage() {
  return (
    <>
      <PageTitle>قسم جديد</PageTitle>
      <Suspense fallback={<Loading />}>
        <Form />
      </Suspense>
    </>
  );
}
