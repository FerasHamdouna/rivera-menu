import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { AuthCard } from '@/components/admin/AuthCard';
import { FirstPasswordForm } from '@/components/admin/AuthForms';
import { requireAdmin } from '@/lib/admin/auth';

async function Gate() {
  const { user } = await requireAdmin({ allowPendingPassword: true });
  if (!user.app_metadata?.must_change_password) redirect('/admin');
  return <FirstPasswordForm />;
}

export default function FirstPasswordPage() {
  return (
    <AuthCard title="كلمة سر جديدة" subtitle="هاي أول مرة بتدخل. غيّر كلمة السر المبدئية قبل ما تكمّل.">
      <Suspense>
        <Gate />
      </Suspense>
    </AuthCard>
  );
}
