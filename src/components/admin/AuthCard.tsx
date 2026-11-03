import type { ReactNode } from 'react';
import { Crown } from '@/components/menu/ornaments';

/** Centered card on dark marble, for the login and first-password pages. */
export function AuthCard({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <main className="grid min-h-svh place-items-center bg-marble px-4 py-10">
      <div className="w-full max-w-sm rounded-3xl border border-gold/40 bg-cream p-6 shadow-2xl">
        <div className="mb-6 text-center">
          <Crown className="mx-auto h-8 w-12 text-gold" />
          <div className="font-[family-name:var(--font-vibes)] text-4xl text-gold-lo" dir="ltr">Rivera</div>
          <h1 className="mt-3 font-display text-2xl font-bold">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        </div>
        {children}
      </div>
    </main>
  );
}
