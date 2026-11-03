import { MenuView, type PublicSection } from '@/components/menu/MenuView';
import { SectionIcon } from '@/components/SectionIcon';
import '@/components/menu/menu.css';
import { imageUrl } from '@/lib/images';
import { getPublicMenu } from '@/lib/public-menu';

// Plate tint for the placeholder art, per section icon. Unknown icons get a stable hue from their name.
const HUES: Record<string, number> = { coffee: 28, milk: 330, 'cup-soda': 0, 'cake-slice': 18, citrus: 40, 'glass-water': 200, flame: 280 };
const hueFor = (icon: string) => HUES[icon] ?? [...icon].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 7);

export default async function MenuPage() {
  const { settings, sections } = await getPublicMenu();

  const publicSections: PublicSection[] = sections.map((s) => ({
    ...s,
    hue: hueFor(s.icon),
    items: s.items.map((it) => ({ ...it, image_url: imageUrl(it.image_path) })),
  }));
  const sectionIcons = Object.fromEntries(sections.map((s) => [s.id, <SectionIcon key={s.id} name={s.icon} />]));

  return <MenuView sections={publicSections} settings={settings} logoUrl={imageUrl(settings.logo_path)} icons={sectionIcons} />;
}
