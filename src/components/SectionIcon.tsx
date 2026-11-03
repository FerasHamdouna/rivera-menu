import { icons, UtensilsCrossed } from 'lucide-react';

/**
 * Lucide icon by its kebab-case name ("cake-slice" → CakeSlice). Server-only use: importing the
 * whole `icons` map in a client component would ship every icon to the browser.
 */
export function SectionIcon({ name, className }: { name: string; className?: string }) {
  const key = name.replace(/(^|-)(\w)/g, (_, __, c: string) => c.toUpperCase()) as keyof typeof icons;
  const Icon = icons[key] ?? UtensilsCrossed;
  return <Icon aria-hidden="true" className={className} />;
}
