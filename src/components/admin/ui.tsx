'use client';

import { useFormStatus } from 'react-dom';
import type { ComponentProps, ReactNode } from 'react';
import type { FormState } from '@/app/admin/actions/auth';
import { btnCls, inputCls, type Variant } from './styles';

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-ink">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function Input(props: ComponentProps<'input'>) {
  return <input {...props} className={`${inputCls} ${props.className ?? ''}`} />;
}

export function Textarea(props: ComponentProps<'textarea'>) {
  return <textarea rows={2} {...props} className={`${inputCls} resize-none ${props.className ?? ''}`} />;
}

/** Submit button that shows progress while its form's action runs. */
export function SubmitButton({ children, pendingText = 'جاري الحفظ…', variant = 'primary', className = '' }: { children: ReactNode; pendingText?: string; variant?: Variant; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`${btnCls(variant)} ${className}`}>
      {pending ? pendingText : children}
    </button>
  );
}

export function Notice({ state }: { state: FormState }) {
  if (!state?.error && !state?.ok) return null;
  return (
    <p role="status" className={`rounded-xl px-3 py-2 text-sm ${state.error ? 'bg-red-50 text-red-800' : 'bg-emerald-50 text-emerald-800'}`}>
      {state.error ?? state.ok}
    </p>
  );
}

/** Small icon button that submits its form; asks first when `confirm` is set. */
export function IconSubmit({ label, confirm, children, className = '' }: { label: string; confirm?: string; children: ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      aria-label={label}
      title={label}
      disabled={pending}
      onClick={(e) => { if (confirm && !window.confirm(confirm)) e.preventDefault(); }}
      className={`grid h-9 w-9 place-items-center rounded-lg text-gold-lo transition hover:bg-gold/15 disabled:opacity-40 [&_svg]:h-[18px] [&_svg]:w-[18px] ${className}`}
    >
      {children}
    </button>
  );
}
