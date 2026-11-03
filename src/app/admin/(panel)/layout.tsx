import { Suspense } from 'react';
import { AdminNav } from '@/components/admin/AdminNav';

export default function PanelLayout({ children }: LayoutProps<'/admin'>) {
  return (
    <>
      {/* The nav highlights the current path, a request-time value */}
      <Suspense fallback={<div className="h-[104px] bg-marble" />}>
        <AdminNav />
      </Suspense>
      <main className="mx-auto max-w-3xl px-4 pb-24 pt-5">{children}</main>
    </>
  );
}
