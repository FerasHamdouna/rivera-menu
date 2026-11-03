import { Suspense } from 'react';
import { ChangeEmailForm, ChangePasswordForm } from '@/components/admin/AuthForms';
import { Loading, PageTitle } from '@/components/admin/Loading';
import { requireAdmin } from '@/lib/admin/auth';

async function Forms() {
  const { user } = await requireAdmin();
  const placeholder = user.email?.endsWith('.local');
  return (
    <div className="space-y-6">
      {placeholder && (
        <p className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
          الإيميل الحالي مبدئي وما بيستقبل رسائل. غيّره لإيميلك الحقيقي عشان تقدر تسترجع كلمة السر إذا نسيتها.
        </p>
      )}
      <section className="rounded-2xl border border-gold/30 bg-paper p-4">
        <h2 className="mb-3 font-bold">الإيميل</h2>
        <ChangeEmailForm current={user.email ?? ''} />
      </section>
      <section className="rounded-2xl border border-gold/30 bg-paper p-4">
        <h2 className="mb-3 font-bold">كلمة السر</h2>
        <ChangePasswordForm />
      </section>
    </div>
  );
}

export default function AccountPage() {
  return (
    <>
      <PageTitle>الحساب</PageTitle>
      <Suspense fallback={<Loading />}>
        <Forms />
      </Suspense>
    </>
  );
}
