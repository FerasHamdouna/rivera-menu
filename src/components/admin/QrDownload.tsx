'use client';

import { Download } from 'lucide-react';
import { btnCls } from './styles';

const W = 1200, H = 1500;

/** Resolves a next/font CSS variable (e.g. --font-vibes) to the real, hashed family name canvas needs. */
function family(cssVar: string, fallback: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim() || fallback;
}

/** Draws the table card (frame, wordmark, QR, captions) on a canvas and saves it as a PNG. */
async function download(matrix: boolean[][], url: string) {
  await document.fonts.ready;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const x = c.getContext('2d')!;
  const gold = '#c99a6b', ink = '#2a211c';

  x.fillStyle = '#f7f0ea';
  x.fillRect(0, 0, W, H);
  x.strokeStyle = gold;
  x.lineWidth = 4;
  x.strokeRect(40, 40, W - 80, H - 80);
  x.lineWidth = 1.5;
  x.strokeRect(58, 58, W - 116, H - 116);

  x.textAlign = 'center';
  x.fillStyle = '#8a5b38';
  x.font = `160px ${family('--font-vibes', 'cursive')}`;
  x.fillText('Rivera', W / 2, 280);
  x.font = `600 34px ${family('--font-cormorant', 'serif')}`;
  x.fillText('C A F E   &   R E S T A U R A N T', W / 2, 340);

  const n = matrix.length + 4, size = 720, cell = size / n, ox = (W - size) / 2, oy = 420;
  x.fillStyle = '#fff';
  x.fillRect(ox, oy, size, size);
  x.fillStyle = ink;
  matrix.forEach((row, r) => row.forEach((dark, col) => dark && x.fillRect(ox + (col + 2) * cell, oy + (r + 2) * cell, Math.ceil(cell), Math.ceil(cell))));
  x.strokeStyle = gold;
  x.lineWidth = 4;
  x.strokeRect(ox - 12, oy - 12, size + 24, size + 24);

  x.fillStyle = ink;
  x.direction = 'rtl';
  x.font = `700 64px ${family('--font-amiri', 'serif')}`;
  x.fillText('امسح الكود لتشوف المينيو', W / 2, 1270);
  x.direction = 'ltr';
  x.fillStyle = '#8a5b38';
  x.font = `500 40px ${family('--font-cinzel', 'serif')}`;
  x.fillText('SCAN FOR THE MENU', W / 2, 1340);
  x.font = `400 28px ${family('--font-tajawal', 'sans-serif')}`;
  x.fillText(url.replace(/^https?:\/\//, '').replace(/\/$/, ''), W / 2, 1395);

  const a = document.createElement('a');
  a.download = 'rivera-menu-qr.png';
  a.href = c.toDataURL('image/png');
  a.click();
}

export function QrDownload({ matrix, url }: { matrix: boolean[][]; url: string }) {
  return (
    <button type="button" onClick={() => download(matrix, url)} className={`${btnCls()} border border-gold/60`}>
      <Download className="h-4 w-4" />تحميل صورة PNG
    </button>
  );
}
