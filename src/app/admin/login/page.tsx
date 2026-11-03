import { Suspense } from 'react';
import { AuthCard } from '@/components/admin/AuthCard';
import { LoginForm } from '@/components/admin/AuthForms';

export default function LoginPage() {
  return (
    <AuthCard title="لوحة التحكم">
      {/* The form reads ?email-changed, a request-time value */}
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
