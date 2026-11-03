'use client';

import { Printer } from 'lucide-react';
import { btnCls } from './styles';

export function PrintButton({ label = 'طباعة / حفظ PDF' }: { label?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className={btnCls('gold')}>
      <Printer className="h-4 w-4" />{label}
    </button>
  );
}
