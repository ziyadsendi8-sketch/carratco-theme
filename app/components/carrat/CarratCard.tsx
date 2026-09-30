import { useMoney } from '@salla.sa/twilight-theme-engine/hooks/useMoney';
import { Link } from '@salla.sa/twilight-theme-engine/common';
import type { Product } from '@salla.sa/twilight-theme-engine/types';
import { useTx } from './i18n';

/** Collection card: gem on a navy gradient, serif name, spec line, bronze price. */
export function CarratCard({ product }: { product: Product }) {
  const { format } = useMoney();
  const { tx } = useTx();
  const from = product.starting_price && Number(product.starting_price) > 0;
  const price = from ? product.starting_price! : product.is_on_sale ? product.sale_price : product.price;
  const meta = product.subtitle || product.promotion_title || '';
  const img = product.image?.url;

  return (
    <Link to={product.url} className="cc-card">
      <div className="cc-card__gem">
        {img ? <img src={img} alt={product.image?.alt || product.name} loading="lazy" /> : null}
      </div>
      <h3>{product.name}</h3>
      {meta && <div className="cc-card__meta">{meta}</div>}
      <div className="cc-price">
        {from && <span className="cc-price__from">{tx('from', 'من')}</span>}
        {format(price, { type: 'product' })}
      </div>
      {product.is_out_of_stock && (
        <div className="cc-card__soon">{tx('Coming soon', 'قريبًا')}</div>
      )}
    </Link>
  );
}
