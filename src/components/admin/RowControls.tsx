import { ArrowDown, ArrowUp, Ban, Eye, EyeOff, Trash2, CircleCheck } from 'lucide-react';
import { IconSubmit } from './ui';

/** Up/down arrows; each is a tiny form so it works before the page's JS loads. */
export function MoveButtons({ up, down, first, last }: { up: () => Promise<void>; down: () => Promise<void>; first: boolean; last: boolean }) {
  return (
    <div className="flex flex-col">
      <form action={up}><IconSubmit label="لفوق" className={first ? 'invisible' : ''}><ArrowUp /></IconSubmit></form>
      <form action={down}><IconSubmit label="لتحت" className={last ? 'invisible' : ''}><ArrowDown /></IconSubmit></form>
    </div>
  );
}

export function HideButton({ hidden, action }: { hidden: boolean; action: () => Promise<void> }) {
  return (
    <form action={action}>
      <IconSubmit label={hidden ? 'إظهار' : 'إخفاء'} className={hidden ? 'bg-ink/10 text-ink' : ''}>{hidden ? <EyeOff /> : <Eye />}</IconSubmit>
    </form>
  );
}

export function UnavailableButton({ out, action }: { out: boolean; action: () => Promise<void> }) {
  return (
    <form action={action}>
      <IconSubmit label={out ? 'رجّعه متوفر' : 'غير متوفر'} className={out ? 'bg-red-100 text-red-800' : ''}>{out ? <Ban /> : <CircleCheck />}</IconSubmit>
    </form>
  );
}

export function DeleteButton({ action, confirm }: { action: () => Promise<void>; confirm: string }) {
  return (
    <form action={action}>
      <IconSubmit label="حذف" confirm={confirm} className="text-red-800 hover:bg-red-50"><Trash2 /></IconSubmit>
    </form>
  );
}
