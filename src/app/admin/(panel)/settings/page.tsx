import { Suspense } from 'react';
import { Loading, PageTitle } from '@/components/admin/Loading';
import { SettingsForm } from '@/components/admin/SettingsForm';
import { requireAdmin } from '@/lib/admin/auth';
import type { Settings } from '@/lib/types';

async function Form() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from('settings').select('*').single();
  return <SettingsForm settings={data as Settings} />;
}

export default function SettingsPage() {
  return (
    <>
      <PageTitle>إعدادات المطعم</PageTitle>
      <Suspense fallback={<Loading />}>
        <Form />
      </Suspense>
    </>
  );
}
