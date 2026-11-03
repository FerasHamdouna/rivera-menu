// Class strings shared by server and client components (a 'use client' module can't export plain values to the server).

export const inputCls =
  'w-full rounded-xl border border-gold/50 bg-paper px-3 py-2.5 text-[16px] text-ink outline-none transition placeholder:text-muted/60 focus:border-gold focus:ring-2 focus:ring-gold/30';

const variants = {
  primary: 'bg-ink text-gold-hi hover:bg-marble',
  gold: 'bg-gold text-ink hover:bg-gold-hi',
  ghost: 'border border-gold/60 text-gold-lo hover:bg-gold/10',
  danger: 'border border-red-800/40 text-red-800 hover:bg-red-50',
};

export function btnCls(variant: Variant = 'primary') {
  return `inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition active:scale-[.98] disabled:opacity-60 ${variants[variant]}`;
}

export type Variant = keyof typeof variants;
