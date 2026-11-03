import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { PrintButton } from '@/components/admin/PrintButton';
import { QrDownload } from '@/components/admin/QrDownload';
import { Crown } from '@/components/menu/ornaments';
import { requireAdmin } from '@/lib/admin/auth';
import { QrSvg, qrMatrix } from '@/lib/qr';
import { getSiteUrl, isLocalUrl } from '@/lib/site-url';
import '../print/print.css';

/** One table card: a quarter of an A4 sheet, so four print per page for cutting. */
function Card({ url }: { url: string }) {
  return (
    <div className="relative flex h-[148.5mm] w-[105mm] flex-col items-center justify-center gap-[3mm] border border-dashed border-gold/40 bg-cream p-[10mm] text-center print:border-gold/30">
      <div className="pointer-events-none absolute inset-[5mm] border-[.4mm] border-gold/70" />
      <div dir="ltr" className="leading-none">
        <Crown className="mx-auto -mb-[2mm] h-[7mm] w-[10mm] translate-x-[9mm] rotate-12 text-gold" />
        <div className="pm-gold font-[family-name:var(--font-vibes)] text-[42px]">Rivera</div>
        <div className="pm-gold font-[family-name:var(--font-cormorant)] text-[10px] tracking-[.2em]">CAFE &amp; RESTAURANT</div>
      </div>
      <QrSvg text={url} className="h-[52mm] w-[52mm] rounded-[2mm] outline outline-[.4mm] outline-gold" />
      <div>
        <div className="font-display text-[19px] font-bold">امسح الكود لتشوف المينيو</div>
        <div className="font-[family-name:var(--font-cinzel)] text-[11px] tracking-[.15em] text-gold-lo" dir="ltr">SCAN FOR THE MENU</div>
      </div>
    </div>
  );
}

async function Cards() {
  await requireAdmin();
  const url = await getSiteUrl();
  return (
    <>
      <div className="no-print mx-auto mb-4 flex max-w-[210mm] flex-wrap items-center gap-2 text-sm text-gold-hi/90">
        <span>الكود بيفتح: <b dir="ltr">{url}</b></span>
        <span className="flex-1" />
        <QrDownload matrix={qrMatrix(url)} url={url} />
      </div>
      {isLocalUrl(url) && (
        <p className="no-print mx-auto mb-4 max-w-[210mm] rounded-xl bg-amber-100 p-3 text-sm text-amber-900">
          هاد عنوان على هالكمبيوتر بس، فالجوالات ما رح تفتحه. اطبع الكود بعد ما ينرفع الموقع على الإنترنت.
        </p>
      )}
      <div className="pm-page !p-0" style={{ background: 'none', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        {[0, 1, 2, 3].map((i) => <Card key={i} url={url} />)}
      </div>
    </>
  );
}

export default function QrPage() {
  return (
    <div className="pm" dir="rtl">
      <div className="no-print sticky top-0 z-10 flex items-center gap-2 bg-marble px-4 py-3">
        <Link href="/admin/print" className="inline-flex items-center gap-1 text-sm text-gold-hi"><ArrowRight className="h-4 w-4" />المينيو المطبوع</Link>
        <span className="flex-1" />
        <PrintButton label="اطبع 4 كروت" />
      </div>
      <div className="pm-desk">
        <Suspense fallback={<div className="mx-auto h-[297mm] w-[210mm] animate-pulse bg-cream/20" />}>
          <Cards />
        </Suspense>
      </div>
    </div>
  );
}
