import qrcode from 'qrcode-generator';

/** QR modules for `text` (error correction Q, so a small logo or a bit of wear still scans). */
export function qrMatrix(text: string): boolean[][] {
  const qr = qrcode(0, 'Q');
  qr.addData(text);
  qr.make();
  const n = qr.getModuleCount();
  return Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, c) => qr.isDark(r, c)));
}

/** Crisp, scalable QR as one SVG path. `quiet` is the blank margin in modules (4 per the spec). */
export function QrSvg({ text, className, color = '#2a211c', quiet = 2 }: { text: string; className?: string; color?: string; quiet?: number }) {
  const m = qrMatrix(text);
  const n = m.length + quiet * 2;
  let d = '';
  m.forEach((row, r) => row.forEach((dark, c) => { if (dark) d += `M${c + quiet} ${r + quiet}h1v1h-1z`; }));
  return (
    <svg viewBox={`0 0 ${n} ${n}`} className={className} shapeRendering="crispEdges" role="img" aria-label={text}>
      <rect width={n} height={n} fill="#fff" />
      <path d={d} fill={color} />
    </svg>
  );
}
