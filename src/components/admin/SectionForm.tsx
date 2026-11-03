'use client';

import { DynamicIcon, type IconName } from 'lucide-react/dynamic';
import { useActionState, useState } from 'react';
import type { FormState } from '@/app/admin/actions/auth';
import type { Section } from '@/lib/types';
import { IconPicker } from './IconPicker';
import { Field, Input, Notice, SubmitButton } from './ui';

type Action = (state: FormState, fd: FormData) => Promise<FormState>;

export function SectionForm({ action, section }: { action: Action; section?: Section }) {
  const [state, formAction] = useActionState(action, null);
  const [icon, setIcon] = useState(section?.icon ?? 'utensils');

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="اسم القسم بالعربي"><Input name="name_ar" defaultValue={section?.name_ar} required placeholder="مشروبات ساخنة" /></Field>
        <Field label="اسم القسم بالإنجليزي" hint="اختياري"><Input name="name_en" defaultValue={section?.name_en ?? ''} dir="ltr" placeholder="Hot Drinks" /></Field>
      </div>
      <input type="hidden" name="icon" value={icon} />
      <div>
        <div className="mb-1.5 flex items-center gap-2 text-sm font-bold">
          الأيقونة
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink text-gold-hi"><DynamicIcon name={icon as IconName} className="h-4 w-4" /></span>
        </div>
        <IconPicker value={icon} onChange={setIcon} />
      </div>
      <Notice state={state} />
      <SubmitButton>{section ? 'احفظ القسم' : 'أضف القسم'}</SubmitButton>
    </form>
  );
}
