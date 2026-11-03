import { ArrowRight, QrCode } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { PrintButton } from '@/components/admin/PrintButton';
import { btnCls } from '@/components/admin/styles';
import { Crown } from '@/components/menu/ornaments';
import { SectionIcon } from '@/components/SectionIcon';
import { requireAdmin } from '@/lib/admin/auth';
import { imageUrl } from '@/lib/images';
import { getPublicMenu } from '@/lib/public-menu';
import { QrSvg } from '@/lib/qr';
import { getSiteUrl, isLocalUrl } from '@/lib/site-url';
import type { MenuItem } from '@/lib/types';
import './print.css';

function Corner() {
  return (
    <svg viewBox="0 0 34 34" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true">
      <path d="M2 32 V10 Q2 2 10 2 H32" /><path d="M8 26 V14 Q8 8 14 8 H26" />
      <path d="M14 14 q6 0 6 6 q-6 0 -6 -6z" fill="currentColor" opacity=".7" />
    </svg>
  );
}

function Price({ it }: { it: MenuItem }) {
  // One isolated chip per size so the Arabic names and numbers can't be reordered (see MenuView Price)
  if (it.sizes.length) return <span className="pr pm-sizes">{it.sizes.map((s) => <span key={s.id} className="sz"><span className="sn">{s.name_ar}</span>{s.price}</span>)}</span>;
  if (it.price == null) return <span className="pr"><span className="ask">حسب الطلب</span></span>;
  return <span className="pr">{it.price}</span>;
}

async function Sheet() {
  await requireAdmin();
  // What a visitor sees right now, minus what's out of stock today.
  const [{ settings, sections }, url] = await Promise.all([getPublicMenu(), getSiteUrl()]);
  const printable = sections.map((s) => ({ ...s, items: s.items.filter((it) => !it.is_unavailable) })).filter((s) => s.items.length);
  const logo = imageUrl(settings.logo_path);
  const hidden = sections.reduce((n, s) => n + s.items.filter((it) => it.is_unavailable).length, 0);

  return (
    <>
      <div className="no-print mx-auto mb-4 max-w-[210mm] space-y-2 text-sm text-gold-hi/90">
        {hidden > 0 && <p>الأصناف غير المتوفرة ({hidden}) مش طالعة بالطباعة.</p>}
        {isLocalUrl(url) && <p className="rounded-xl bg-amber-100 p-3 text-amber-900">الـ QR هلأ بيفتح <b dir="ltr">{url}</b>، وهاد بيشتغل بس على هالكمبيوتر. اطبع بعد ما ينرفع الموقع على الإنترنت.</p>}
      </div>
      <article className="pm-page">
        <div className="pm-frame"><Corner /><Corner /><Corner /><Corner /></div>
        <header className="pm-head">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded logo
            <img src={logo} alt="Rivera" />
          ) : (
            <div dir="ltr">
              <Crown className="crown" />
              <div className="word pm-gold">Rivera</div>
              <div className="sub pm-gold">CAFE &amp; RESTAURANT</div>
            </div>
          )}
        </header>
        <div className="pm-cols">
          {printable.map((s) => (
            <section key={s.id} className="pm-blk">
              <h2 className="pm-pill"><SectionIcon name={s.icon} />{s.name_ar}</h2>
              {s.items.map((it) => (
                <div key={it.id} className="pm-row">
                  <span className="nm">
                    {it.name_ar}
                    {it.name_en && <small>{it.name_en}</small>}
                    {it.flavors.length > 0 && <span className="note">({it.flavors.map((f) => f.name_ar).join(' - ')})</span>}
                  </span>
                  <span className="dots" />
                  <Price it={it} />
                </div>
              ))}
            </section>
          ))}
        </div>
        <footer className="pm-foot">
          <div className="info">
            {settings.phone && <span dir="ltr" style={{ textAlign: 'right' }}>☎ {settings.phone}</span>}
            {settings.address && <span>{settings.address}</span>}
            {settings.hours_text && <span>{settings.hours_text}</span>}
            <span>الأسعار بالشيكل ₪</span>
          </div>
          <div className="qr">
            <QrSvg text={url} />
            <span>SCAN FOR THE<br />DIGITAL MENU</span>
          </div>
        </footer>
      </article>
    </>
  );
}

export default function PrintPage() {
  return (
    <div className="pm" dir="rtl">
      <div className="no-print sticky top-0 z-10 flex flex-wrap items-center gap-2 bg-marble px-4 py-3">
        <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-gold-hi"><ArrowRight className="h-4 w-4" />لوحة التحكم</Link>
        <span className="flex-1" />
        <Link href="/admin/qr" className={`${btnCls()} border border-gold/60`}><QrCode className="h-4 w-4" />QR للطاولات</Link>
        <PrintButton />
      </div>
      <div className="pm-desk">
        <Suspense fallback={<div className="mx-auto h-[297mm] w-[210mm] animate-pulse bg-cream/20" />}>
          <Sheet />
        </Suspense>
      </div>
    </div>
  );
}
