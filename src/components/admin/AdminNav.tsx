'use client';

import { ExternalLink, LayoutList, LogOut, Printer, Settings, UserRound } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '@/app/admin/actions/auth';

const LINKS = [
  { href: '/admin', label: 'الأقسام', icon: LayoutList, match: (p: string) => p === '/admin' || p.startsWith('/admin/sections') || p.startsWith('/admin/items') },
  { href: '/admin/print', label: 'الطباعة', icon: Printer, match: (p: string) => p.startsWith('/admin/print') || p.startsWith('/admin/qr') },
  { href: '/admin/settings', label: 'الإعدادات', icon: Settings, match: (p: string) => p.startsWith('/admin/settings') },
  { href: '/admin/account', label: 'الحساب', icon: UserRound, match: (p: string) => p.startsWith('/admin/account') },
];

export function AdminNav() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-30 bg-marble text-gold-hi shadow-lg">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-4 py-2.5">
        <Link href="/admin" className="font-[family-name:var(--font-vibes)] text-3xl leading-none text-gold" dir="ltr">Rivera</Link>
        <div className="flex items-center gap-1">
          <a href="/" target="_blank" className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs hover:bg-white/10">
            <ExternalLink className="h-4 w-4" /><span className="max-sm:hidden">عرض المينيو</span>
          </a>
          <form action={logout}>
            <button className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs hover:bg-white/10" aria-label="خروج">
              <LogOut className="h-4 w-4" /><span className="max-sm:hidden">خروج</span>
            </button>
          </form>
        </div>
      </div>
      <nav className="mx-auto flex max-w-3xl gap-1 px-3 pb-2">
        {LINKS.map(({ href, label, icon: Icon, match }) => (
          <Link key={href} href={href} className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-sm max-[400px]:flex-col max-[400px]:gap-0.5 max-[400px]:text-xs transition ${match(path) ? 'bg-gold font-bold text-ink' : 'text-gold-hi/80 hover:bg-white/10'}`}>
            <Icon className="h-4 w-4" />{label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
