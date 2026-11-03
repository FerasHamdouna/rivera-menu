import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rivera · لوحة التحكم',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<'/admin'>) {
  return <div dir="rtl" lang="ar" className="min-h-svh bg-cream font-admin text-ink">{children}</div>;
}
