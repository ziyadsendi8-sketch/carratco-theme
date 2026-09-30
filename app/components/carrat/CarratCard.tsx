import { Link } from '@salla.sa/twilight-theme-engine/common';
import type { Product } from '@salla.sa/twilight-theme-engine/types';
import { specFor } from './catalog';
import { Price, caratLabel } from './format';
import { useTx } from './i18n';

/** Price a shopper actually pays for a product right now. */
export function priceOf(p: Product): number {
  return Number(p.is_on_sale ? p.sale_price : p.price) || 0;
}

/**
 * Collection card — gem on the navy gradient, "Oval · 1 ct", "F · VS2", bronze price.
 * `group` = several products of the same shape shown as one listing
 * ("Round · Several carats · from 699").
 */
export function CarratCard({ product, group }: { product: Product; group?: Product[] }) {
  const { tx, isAr } = useTx();
  const spec = specFor(product);
  const shape = isAr ? spec.shapeAr : spec.shapeEn;
  const isGroup = !!group && group.length > 1;

  let title: string = product.name;
  let meta = product.subtitle || '';
  if (spec.shapeKey) {
    title = isGroup || spec.ct == null ? shape : `${shape}${isAr ? ' ' : ' · '}${caratLabel(spec.ct, isAr)}`;
    if (isGroup) meta = tx('Several carats', 'عدّة أوزان');
    else if (spec.colored) meta = (isAr ? spec.gradeAr : spec.gradeEn) || meta;
    else if (spec.gradeEn) meta = [spec.gradeEn, spec.clarity].filter(Boolean).join(' · ');
  }
  const amount = isGroup ? Math.min(...group!.map(priceOf)) : priceOf(product);
  const img = product.image?.url;

  return (
    <Link to={product.url} className="cc-card">
      <div className="cc-card__gem">{img ? <img src={img} alt={shape} loading="lazy" /> : null}</div>
      <h3>{title}</h3>
      {meta && <div className="cc-card__meta">{meta}</div>}
      <Price amount={amount} isAr={isAr} from={isGroup} />
      {product.is_out_of_stock && <div className="cc-card__soon">{tx('Coming soon', 'قريبًا')}</div>}
    </Link>
  );
}
