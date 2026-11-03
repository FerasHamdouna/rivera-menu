'use client';

import { Clock, LayoutGrid, MapPin, MessageCircle, Phone, ScrollText, Search, X, Link as LinkIcon } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import type { MenuItem, MenuSection, Settings } from '@/lib/types';
import { Frame, Logo } from './ornaments';
import { CREDIT_WHATSAPP, STRINGS, describe, other, pick, type Lang, type View } from './strings';

export type PublicItem = MenuItem & { image_url: string | null };
export type PublicSection = Omit<MenuSection, 'items'> & { items: PublicItem[]; hue: number };

type Props = {
  sections: PublicSection[];
  settings: Settings;
  logoUrl: string | null;
  /** Section icons rendered on the server, keyed by section id, so the icon set never ships to the browser. */
  icons: Record<string, ReactNode>;
};

const LANG_KEY = 'rivera.lang';
const VIEW_KEY = 'rivera.view';
const store = {
  get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
};

/** Marks the whole word that contains the search match ("tea" marks all of "Tea"). */
function Highlight({ text, term }: { text: string; term: string }) {
  if (!term) return text;
  const i = text.toLowerCase().indexOf(term.toLowerCase());
  if (i < 0) return text;
  const start = text.lastIndexOf(' ', i) + 1;
  const space = text.indexOf(' ', i + term.length);
  const end = space < 0 ? text.length : space;
  return <>{text.slice(0, start)}<mark>{text.slice(start, end)}</mark>{text.slice(end)}</>;
}

/**
 * Sizes render as separate isolated chips ("صغير 25", "كبير 35"): one mixed string lets the bidi
 * algorithm reorder the Arabic names and the numbers. `compact` (photo tiles) shows the lowest price.
 */
function Price({ item, lang, compact }: { item: PublicItem; lang: Lang; compact?: boolean }) {
  if (item.sizes.length) {
    if (compact) {
      const min = Math.min(...item.sizes.map((s) => s.price));
      return <span className="rv-price"><span className="ask">{STRINGS[lang].from} </span>{min}<span className="cur">₪</span></span>;
    }
    return (
      <span className="rv-price rv-sizes">
        {item.sizes.map((s) => <span key={s.id} className="sz"><span className="sn">{pick(s, lang)}</span>{s.price}</span>)}
      </span>
    );
  }
  if (item.price == null) return <span className="rv-price"><span className="ask">{STRINGS[lang].ask}</span></span>;
  return <span className="rv-price">{item.price}<span className="cur">₪</span></span>;
}

function Art({ section, item, index, icon }: { section: PublicSection; item: PublicItem; index: number; icon: ReactNode }) {
  const style = { '--h': section.hue, '--a': `${(index * 47) % 360}deg` } as CSSProperties;
  return (
    <div className="rv-art" style={style}>
      {item.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element -- already resized to ~800px WebP on upload
        <img src={item.image_url} alt="" loading="lazy" decoding="async" />
      ) : icon}
    </div>
  );
}

function Sheet({ open, onClose, lang, children }: { open: boolean; onClose: () => void; lang: Lang; children: ReactNode }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    addEventListener('keydown', onKey);
    return () => { cancelAnimationFrame(id); removeEventListener('keydown', onKey); setShown(false); };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <>
      <div className={`rv-sheet-bg ${shown ? 'open' : ''}`} onClick={onClose} />
      <div className={`rv-sheet ${shown ? 'open' : ''}`} role="dialog" aria-modal="true">
        <button className="close" onClick={onClose} aria-label={STRINGS[lang].close}><X /></button>
        {children}
      </div>
    </>
  );
}

export function MenuView({ sections, settings, logoUrl, icons }: Props) {
  const [lang, setLang] = useState<Lang>('ar');
  const [view, setView] = useState<View>('list');
  const [term, setTerm] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [lifted, setLifted] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const t = STRINGS[lang];

  // Restore the visitor's last choices. Read after mount so server and client render the same first frame.
  useEffect(() => {
    const l = store.get(LANG_KEY), v = store.get(VIEW_KEY);
    /* eslint-disable react-hooks/set-state-in-effect -- one-time sync from localStorage */
    if (l === 'en') setLang('en');
    if (v === 'grid') setView('grid');
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const rootRef = useRef<HTMLDivElement>(null);

  const changeLang = (l: Lang, e: MouseEvent) => {
    if (l === lang) return;
    store.set(LANG_KEY, l);
    if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return setLang(l);
    // Circle reveal centred on the toggle, big enough to reach the farthest corner.
    const html = document.documentElement, x = e.clientX, y = e.clientY;
    html.style.setProperty('--vx', `${x}px`);
    html.style.setProperty('--vy', `${y}px`);
    html.style.setProperty('--vr', `${Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))}px`);
    html.dataset.vt = 'lang';
    document.startViewTransition(() => flushSync(() => setLang(l))).finished.finally(() => delete html.dataset.vt);
  };
  const changeView = (v: View) => {
    if (v === view) return;
    store.set(VIEW_KEY, v);
    const root = rootRef.current;
    if (!document.startViewTransition || !root) return setView(v);
    // Morph each item from its list row to its photo tile.
    root.classList.add('vt-view');
    document.startViewTransition(() => flushSync(() => setView(v))).finished.finally(() => root.classList.remove('vt-view'));
  };

  const filtered = useMemo(() => {
    const q = term.trim().toLowerCase();
    return sections
      .map((s) => ({ ...s, items: q ? s.items.filter((it) => [it.name_ar, it.name_en ?? ''].some((n) => n.toLowerCase().includes(q))) : s.items }))
      .filter((s) => s.items.length);
  }, [sections, term]);

  // "Print" each block as it scrolls into view. Observes the wrapper: a fully clipped element never intersects.
  useEffect(() => {
    const root = contentRef.current;
    if (!root) return;
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.firstElementChild?.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: 0.05 });
    root.querySelectorAll('.rv-blkw').forEach((w) => io.observe(w));
    return () => io.disconnect();
  }, [filtered, view]);

  const openItem = (id: string) => {
    setLifted(id);
    setTimeout(() => { setLifted(null); setOpenId(id); }, 220);
  };

  const found = (() => {
    for (const s of sections) {
      const i = s.items.findIndex((it) => it.id === openId);
      if (i >= 0) return { section: s, item: s.items[i], index: i };
    }
    return null;
  })();

  const vt = (id: string) => ({ '--vtn': `it-${id}` }) as CSSProperties;
  const q = term.trim();

  return (
    <div className="rv" ref={rootRef} lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="rv-desk">
        <article className="rv-paper">
          <Frame />
          <header className="rv-brand"><Logo src={logoUrl} /></header>

          <div className="rv-tools">
            <label className="rv-search">
              <Search />
              <input type="search" value={term} onChange={(e) => setTerm(e.target.value)} placeholder={t.search} aria-label={t.search} />
            </label>
            <div className="rv-seg" role="group">
              <button className={view === 'list' ? 'on' : ''} onClick={() => changeView('list')} aria-pressed={view === 'list'}><ScrollText /><span className="lbl">{t.list}</span></button>
              <button className={view === 'grid' ? 'on' : ''} onClick={() => changeView('grid')} aria-pressed={view === 'grid'}><LayoutGrid /><span className="lbl">{t.grid}</span></button>
            </div>
            <div className="rv-seg rv-lang" role="group" aria-label="Language">
              <button className={lang === 'ar' ? 'on' : ''} onClick={(e) => changeLang('ar', e)} aria-pressed={lang === 'ar'}>ع</button>
              <button className={lang === 'en' ? 'on' : ''} onClick={(e) => changeLang('en', e)} aria-pressed={lang === 'en'}>EN</button>
            </div>
          </div>

          <div ref={contentRef}>
            {!filtered.length && <div className="rv-empty">{t.empty}</div>}
            {view === 'list' ? (
              <div className="rv-cols">
                {filtered.map((s) => (
                  <div className="rv-blkw" key={s.id}>
                    <section className={`rv-blk ${q ? 'in' : ''}`}>
                      <h2 className="rv-pill">{icons[s.id]}{pick(s, lang)}</h2>
                      {s.items.map((it) => (
                        <button key={it.id} className={`rv-row ${it.is_unavailable ? 'is-out' : ''} ${lifted === it.id ? 'lift' : ''}`} style={vt(it.id)} onClick={() => openItem(it.id)}>
                          <span className="nm">
                            <Highlight text={pick(it, lang)} term={q} />
                            {other(it, lang) && <small><Highlight text={other(it, lang)!} term={q} /></small>}
                          </span>
                          {it.is_unavailable && <span className="rv-out">{t.out}</span>}
                          <span className="dots" />
                          <Price item={it} lang={lang} />
                        </button>
                      ))}
                    </section>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rv-grid">
                {filtered.map((s) => [
                  <h2 className="rv-gsec" key={s.id}>{icons[s.id]}{pick(s, lang)}</h2>,
                  ...s.items.map((it) => (
                    <button key={it.id} className={`rv-tile ${it.is_unavailable ? 'is-out' : ''}`} style={vt(it.id)} onClick={() => openItem(it.id)}>
                      <Art section={s} item={it} index={sections.find((x) => x.id === s.id)!.items.indexOf(it)} icon={icons[s.id]} />
                      <span className="t"><span><Highlight text={pick(it, lang)} term={q} /></span><Price item={it} lang={lang} compact /></span>
                    </button>
                  )),
                ])}
              </div>
            )}
          </div>

          <footer className="rv-foot">
            {settings.phone && <a className="line" href={`tel:${settings.phone.replace(/\s/g, '')}`} dir="ltr"><Phone />{settings.phone}</a>}
            {settings.address && <span className="line"><MapPin />{settings.address}</span>}
            {settings.hours_text && <span className="line"><Clock />{settings.hours_text}</span>}
            {(settings.instagram_url || settings.facebook_url || settings.extra_links?.length > 0) && (
              <div className="links">
                {settings.instagram_url && <a href={settings.instagram_url} target="_blank" rel="noopener">Instagram</a>}
                {settings.facebook_url && <a href={settings.facebook_url} target="_blank" rel="noopener">Facebook</a>}
                {settings.extra_links?.map((l) => <a key={l.url} href={l.url} target="_blank" rel="noopener"><LinkIcon size={13} style={{ verticalAlign: -2, marginInlineEnd: 4 }} />{l.label}</a>)}
              </div>
            )}
            <div className="sig">RIVERA · CAFE &amp; RESTAURANT</div>
            <div className="credit">
              <span>{t.madeBy} <b>{t.author}</b></span>
              <a className="wa" href={CREDIT_WHATSAPP.link} target="_blank" rel="noopener" aria-label={`WhatsApp ${CREDIT_WHATSAPP.display}`}>
                <MessageCircle /><span dir="ltr">{CREDIT_WHATSAPP.display}</span>
              </a>
            </div>
          </footer>
        </article>
      </div>

      <Sheet open={!!found} onClose={() => setOpenId(null)} lang={lang}>
        {found && (
          <>
            <Art section={found.section} item={found.item} index={found.index} icon={icons[found.section.id]} />
            <div className="body">
              <div className="head">
                <div>
                  <h3>{pick(found.item, lang)}</h3>
                  {other(found.item, lang) && <div className="alt">{other(found.item, lang)}</div>}
                </div>
                {!found.item.sizes.length && (
                  <div className="big rv-gold">{found.item.price == null ? t.ask : `${found.item.price} ₪`}</div>
                )}
              </div>
              {found.item.is_unavailable && <div style={{ marginTop: 10 }}><span className="rv-out">{t.out}</span></div>}
              {describe(found.item, lang) && <p>{describe(found.item, lang)}</p>}
              {found.item.sizes.length > 0 && (
                <>
                  <div className="lbl">{t.sizes}</div>
                  {found.item.sizes.map((z) => <div className="row" key={z.id}><span>{pick(z, lang)}</span><b className="rv-gold">{z.price} ₪</b></div>)}
                </>
              )}
              {found.item.flavors.length > 0 && (
                <>
                  <div className="lbl">{t.flavors}</div>
                  <div className="chips">{found.item.flavors.map((f) => <span key={f.id}>{pick(f, lang)}</span>)}</div>
                </>
              )}
            </div>
          </>
        )}
      </Sheet>
    </div>
  );
}
