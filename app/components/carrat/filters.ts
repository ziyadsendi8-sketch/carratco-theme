import type { Product } from '@salla.sa/twilight-theme-engine/types';

/** Shape keywords (EN + AR) → canonical shape key. Order matters (first match wins). */
export const SHAPES: { key: string; en: string; ar: string; re: RegExp }[] = [
  { key: 'round', en: 'Round', ar: 'دائري', re: /round|دائري/i },
  { key: 'oval', en: 'Oval', ar: 'بيضاوي', re: /oval|بيضاوي/i },
  { key: 'cushion', en: 'Cushion', ar: 'وسادة', re: /cushion|وساد/i },
  { key: 'emerald', en: 'Emerald', ar: 'زمردي', re: /emerald|زمرد/i },
  { key: 'pear', en: 'Pear', ar: 'دمعة', re: /pear|دمع/i },
  { key: 'heart', en: 'Heart', ar: 'قلب', re: /heart|قلب/i },
  { key: 'princess', en: 'Princess', ar: 'أميرة', re: /princess|أمير/i },
  { key: 'radiant', en: 'Radiant', ar: 'مشع', re: /radiant|مشع/i },
  { key: 'marquise', en: 'Marquise', ar: 'ماركيز', re: /marquise|ماركيز/i },
];

const COLOURED = /pink|yellow|blue|green|fancy|colou?red|وردي|أصفر|ازرق|أزرق|أخضر|ملون|ملوّن/i;

const AR_DIGITS: Record<string, string> = {
  '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4', '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9', '٫': '.',
};

function text(p: Product) {
  return `${p.name} ${p.subtitle || ''}`;
}

export function shapeOf(p: Product): string | null {
  const t = text(p);
  return SHAPES.find((s) => s.re.test(t))?.key ?? null;
}

export function isColoured(p: Product): boolean {
  return COLOURED.test(text(p));
}

/** First carat figure in the name/subtitle ("2 ct", "٠٫٥٠ قيراط", "2–2.35 ct"). */
export function caratOf(p: Product): number | null {
  const t = text(p).replace(/[٠-٩٫]/g, (d) => AR_DIGITS[d] ?? d);
  const m = t.match(/(\d+(?:\.\d+)?)\s*(?:[–-]\s*\d+(?:\.\d+)?\s*)?(?:ct|carat|قيراط)/i);
  return m ? parseFloat(m[1]) : null;
}

export type CaratBand = 'all' | 'u1' | '1-2' | '2+';

export function inCaratBand(p: Product, band: CaratBand) {
  if (band === 'all') return true;
  const c = caratOf(p);
  if (c == null) return false;
  if (band === 'u1') return c < 1;
  if (band === '1-2') return c >= 1 && c < 2;
  return c >= 2;
}
