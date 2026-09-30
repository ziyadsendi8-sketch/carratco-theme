import { Fragment } from 'react';
import { SallaOffer } from '@salla.sa/twilight-components-react/offer';
import { HookSlot, usePageConfig } from '@salla.sa/twilight-theme-engine/hooks';
import { useProduct } from '@salla.sa/twilight-theme-engine/hooks/useProduct';
import { Link } from '@salla.sa/twilight-theme-engine/common';
import type { ProductPageProps } from '@salla.sa/twilight-theme-engine/routes/product';
import type { Product } from '@salla.sa/twilight-theme-engine/types';
import { AddToCartForm } from '../product/AddToCartForm';
import { groupKey, specFor } from './catalog';
import { Price, caratLabel } from './format';
import { priceOf } from './CarratCard';
import { useStones } from './useStones';
import { useTx } from './i18n';

const IG = 'https://instagram.com/carratandco';

/**
 * Carrat product page — the design's split view: the stone large on a navy
 * panel, and beside it the eyebrow, name, price, description, carat selector
 * (for stones sold as one listing, e.g. Round), the spec table, notes, then
 * Salla's own add-to-cart form (options, quantity, checkout) and inquiry links.
 */
export function CarratProductPage({ product: initialProduct, page }: ProductPageProps) {
  const { product } = useProduct(initialProduct);
  usePageConfig(page);
  const { tx, isAr } = useTx();
  const spec = specFor(product);
  const { products } = useStones();

  const gk = groupKey(product);
  const siblings: Product[] = gk
    ? products
        .filter((p) => groupKey(p) === gk)
        .sort((a, b) => (specFor(a).ct ?? 0) - (specFor(b).ct ?? 0))
    : [];

  const shape = isAr ? spec.shapeAr : spec.shapeEn;
  const title = spec.shapeKey ? (isAr ? product.name : `${spec.shapeEn} Diamond`) : product.name;
  const desc = (isAr ? spec.descAr : spec.descEn) || '';
  const white = tx('White', 'أبيض');
  const colourVal = spec.colored
    ? (isAr ? spec.gradeAr : spec.gradeEn)
    : spec.gradeEn
      ? `${white} · ${spec.gradeEn}`
      : null;

  const rows: [string, string | null][] = [
    [tx('Type', 'النوع'), tx('Lab-grown', 'ألماس مخبري')],
    [tx('Shape', 'الشكل'), spec.shapeKey ? shape : null],
    [tx('Carat', 'القيراط'), spec.ct != null ? caratLabel(spec.ct, isAr) : null],
    [tx('Colour', 'اللون'), colourVal],
    [tx('Clarity', 'النقاء'), spec.clarity],
    [tx('Cut', 'القصة'), spec.shapeKey ? tx('Excellent', 'ممتاز') : null],
    [tx('Certificate', 'الشهادة'), 'GIA / IGI'],
  ];

  return (
    <Fragment key={product.id}>
      <HookSlot name="product:start" />
      <div className="cc-pp-back cc-wrap">
        <Link to="/diamonds" className="cc-back">
          <span aria-hidden="true">{isAr ? '›' : '‹'}</span> {tx('Back', 'رجوع')}
        </Link>
      </div>

      <div className="cc-pp" id={`product-${product.id}`}>
        <div className="cc-pp__visual">
          {product.image?.url && <img src={product.image.url} alt={product.image.alt || product.name} />}
        </div>

        <div className="cc-pp__body">
          <div className="cc-lab">
            {tx('Lab-grown', 'ألماس مخبري')} · {tx('Certified', 'موثّقة')}
          </div>
          <h1>{title}</h1>
          <div className="cc-pp__price">
            <Price amount={priceOf(product)} isAr={isAr} />
          </div>
          {desc && <p className="cc-pp__desc">{desc}</p>}

          {siblings.length > 1 && (
            <div className="cc-varsel">
              <div className="cc-varsel__label">{tx('Select carat', 'اختر القيراط')}</div>
              <div className="cc-varsel__opts">
                {siblings.map((s) => {
                  const ct = specFor(s).ct;
                  return (
                    <Link key={s.id} to={s.url} className={s.id === product.id ? 'is-active' : ''} replace>
                      {ct != null ? caratLabel(ct, isAr) : s.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          <ul className="cc-specs">
            {rows
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <li key={k}>
                  <span className="cc-specs__k">{k}</span>
                  <span>{v}</span>
                </li>
              ))}
          </ul>

          {siblings.length > 1 && (
            <p className="cc-note">
              {tx(
                'More carats, colours and clarities available on request.',
                'تتوفّر أوزان وألوان ودرجات نقاء أخرى عند الطلب.'
              )}
            </p>
          )}
          <p className="cc-note">
            {tx(
              'GIA / IGI certificate number available on request via Instagram DM (@carratandco) for independent verification.',
              'رقم شهادة GIA / IGI متاح عند الطلب عبر إنستغرام (@carratandco) للتحقق المستقل.'
            )}
          </p>
          <p className="cc-note cc-note--lift">
            {tx(
              "Prefer it set? Purchase the stone and we'll send a bespoke setting quotation.",
              'تفضّله مركّبًا؟ اشترِ الألماس وسنرسل لك عرض سعرٍ خاص للتركيب.'
            )}
          </p>

          <div className="cc-pp__form">
            <HookSlot name="product:single.form.start" />
            <AddToCartForm product={product} stickyAddToCart={false} />
            <HookSlot name="product:single.form.end" />
          </div>

          <div className="cc-pp__actions">
            <a className="cc-btn" href={IG} target="_blank" rel="noopener noreferrer">
              {tx('Inquire on Instagram', 'استفسر عبر إنستغرام')}
            </a>
            <a className="cc-btn" href="mailto:info@carratandco.com">
              {tx('Inquire by email', 'استفسر عبر البريد')}
            </a>
          </div>
        </div>
      </div>

      <div className="cc-wrap">
        <SallaOffer />
      </div>
      <HookSlot name="product:end" />
    </Fragment>
  );
}
