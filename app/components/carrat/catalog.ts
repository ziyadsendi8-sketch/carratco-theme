import type { Product } from '@salla.sa/twilight-theme-engine/types';
import { DESIGN_STONES, type DesignStone } from './content';
import { SHAPES, shapeOf, caratOf, isColoured } from './filters';

/** Everything the design shows about a stone, resolved from a live Salla product. */
export interface StoneSpec {
  shapeKey: string | null;
  shapeEn: string;
  shapeAr: string;
  ct: number | null;
  colored: boolean;
  gradeEn: string | null;
  gradeAr: string | null;
  clarity: string | null;
  descEn: string | null;
  descAr: string | null;
}

function designFor(shapeKey: string | null, colored: boolean): DesignStone[] {
  if (!shapeKey) return [];
  return DESIGN_STONES.filter(
    (d) => d.shape.toLowerCase() === shapeKey && (d.color === 'Colored') === colored
  );
}

/**
 * Match a store product to the approved design data (grade, clarity, copy) by
 * shape + colour + carat, so the storefront can print the same spec table as
 * the design even though the Salla products only carry a name and a price.
 */
export function specFor(p: Product): StoneSpec {
  const shapeKey = shapeOf(p);
  const ct = caratOf(p);
  const colored = isColoured(p);
  const shape = SHAPES.find((s) => s.key === shapeKey);
  const spec: StoneSpec = {
    shapeKey,
    shapeEn: shape?.en ?? p.name,
    shapeAr: shape?.ar ?? p.name,
    ct,
    colored,
    gradeEn: null,
    gradeAr: null,
    clarity: null,
    descEn: null,
    descAr: null,
  };
  const near = (a?: number | null, b?: number | null) => a != null && b != null && Math.abs(a - b) < 0.2;

  for (const d of designFor(shapeKey, colored)) {
    if (d.kind === 'variant' && d.variants) {
      const v = d.variants.find((x) => near(x.ct, ct)) ?? null;
      if (!v && ct != null) continue;
      return {
        ...spec,
        gradeEn: v?.grade ?? null,
        gradeAr: v?.grade ?? null,
        clarity: v?.clarity ?? null,
        descEn: d.en,
        descAr: d.ar,
      };
    }
    if (ct == null || near(d.ct, ct)) {
      return {
        ...spec,
        gradeEn: d.grade ?? null,
        gradeAr: d.gradeAr ?? d.grade ?? null,
        clarity: d.clarity ?? null,
        descEn: d.en,
        descAr: d.ar,
      };
    }
  }
  return spec;
}

/** Shapes the design sells as ONE listing with a carat selector (currently Round). */
export const GROUPED_SHAPES = new Set(['round']);

export function groupKey(p: Product): string | null {
  const s = shapeOf(p);
  return s && GROUPED_SHAPES.has(s) && !isColoured(p) ? s : null;
}
