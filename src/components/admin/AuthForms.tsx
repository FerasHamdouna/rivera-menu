'use client';

import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { changeEmail, changePassword, login, setFirstPassword } from '@/app/admin/actions/auth';
import { Field, Input, Notice, SubmitButton } from './ui';

export function LoginForm() {
  const [state, action] = useActionState(login, null);
  const emailChanged = useSearchParams().has('email-changed');
  return (
    <form action={action} className="space-y-4">
      {emailChanged && !state && <Notice state={{ ok: 'تغيّر الإيميل. ادخل بالإيميل الجديد.' }} />}
      <Field label="الإيميل"><Input name="email" type="email" autoComplete="username" dir="ltr" required /></Field>
      <Field label="كلمة السر"><Input name="password" type="password" autoComplete="current-password" dir="ltr" required /></Field>
      <Notice state={state} />
      <SubmitButton className="w-full" pendingText="جاري الدخول…">دخول</SubmitButton>
    </form>
  );
}

function NewPasswordFields() {
  return (
    <>
      <Field label="كلمة السر الجديدة" hint="8 أحرف أو أكثر"><Input name="new_password" type="password" autoComplete="new-password" dir="ltr" minLength={8} required /></Field>
      <Field label="أعد كتابة كلمة السر"><Input name="confirm_password" type="password" autoComplete="new-password" dir="ltr" minLength={8} required /></Field>
    </>
  );
}

export function FirstPasswordForm() {
  const [state, action] = useActionState(setFirstPassword, null);
  return (
    <form action={action} className="space-y-4">
      <NewPasswordFields />
      <Notice state={state} />
      <SubmitButton className="w-full">احفظ وكمّل</SubmitButton>
    </form>
  );
}

export function ChangePasswordForm() {
  const [state, action] = useActionState(changePassword, null);
  return (
    <form action={action} className="space-y-4">
      <Field label="كلمة السر الحالية"><Input name="current_password" type="password" autoComplete="current-password" dir="ltr" required /></Field>
      <NewPasswordFields />
      <Notice state={state} />
      <SubmitButton>غيّر كلمة السر</SubmitButton>
    </form>
  );
}

export function ChangeEmailForm({ current }: { current: string }) {
  const [state, action] = useActionState(changeEmail, null);
  return (
    <form action={action} className="space-y-4">
      <p className="text-sm text-muted">الإيميل الحالي: <b dir="ltr" className="text-ink">{current}</b></p>
      <Field label="الإيميل الجديد"><Input name="email" type="email" dir="ltr" required /></Field>
      <Field label="أعد كتابة الإيميل الجديد" hint="تأكد منه منيح: هو اللي بتسترجع فيه كلمة السر إذا نسيتها"><Input name="email_again" type="email" dir="ltr" required /></Field>
      <Field label="كلمة السر الحالية"><Input name="current_password" type="password" autoComplete="current-password" dir="ltr" required /></Field>
      <Notice state={state} />
      <SubmitButton>غيّر الإيميل</SubmitButton>
    </form>
  );
}
