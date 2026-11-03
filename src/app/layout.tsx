import type { Metadata, Viewport } from 'next';
import { Amiri, Cinzel, Cormorant_Garamond, Great_Vibes, Tajawal } from 'next/font/google';
import './globals.css';

const amiri = Amiri({ variable: '--font-amiri', subsets: ['arabic', 'latin'], weight: ['400', '700'] });
const tajawal = Tajawal({ variable: '--font-tajawal', subsets: ['arabic', 'latin'], weight: ['400', '500', '700'] });
const cinzel = Cinzel({ variable: '--font-cinzel', subsets: ['latin'], weight: ['500', '700'] });
const cormorant = Cormorant_Garamond({ variable: '--font-cormorant', subsets: ['latin'], weight: ['500', '600'], style: ['normal', 'italic'] });
const vibes = Great_Vibes({ variable: '--font-vibes', subsets: ['latin'], weight: '400' });

export const metadata: Metadata = {
  title: 'Rivera · المينيو',
  description: 'مينيو Rivera Cafe & Restaurant · لحظاتك تستحق التميز',
};

export const viewport: Viewport = {
  themeColor: '#2a2421',
  viewportFit: 'cover',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    // suppressHydrationWarning: browser extensions add attributes to <html> before React loads,
    // and MenuView switches lang/dir on it at runtime.
    <html lang="ar" dir="rtl" suppressHydrationWarning className={[amiri, tajawal, cinzel, cormorant, vibes].map((f) => f.variable).join(' ')}>
      <body>{children}</body>
    </html>
  );
}
