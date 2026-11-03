import 'server-only';
import { headers } from 'next/headers';

/**
 * Public address of the menu, for QR codes. NEXT_PUBLIC_SITE_URL wins (set it once a custom domain
 * exists); otherwise it's the host this request came in on, e.g. the Vercel URL.
 */
export async function getSiteUrl(): Promise<string> {
  const fixed = process.env.NEXT_PUBLIC_SITE_URL;
  if (fixed) return fixed.replace(/\/+$/, '') + '/';
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000';
  const proto = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https');
  return `${proto}://${host}/`;
}

/** A localhost URL only opens on this computer, so a QR for it is useless on a phone. */
export const isLocalUrl = (url: string) => /\/\/(localhost|127\.|\[::1\])/.test(url);
