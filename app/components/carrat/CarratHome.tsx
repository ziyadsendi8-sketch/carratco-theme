import { Link } from '@salla.sa/twilight-theme-engine/common';
import hero1 from '../../assets/carrat/images/hero-1.webp';
import hero2 from '../../assets/carrat/images/hero-2.webp';
import hero3 from '../../assets/carrat/images/hero-3.webp';
import { useTx } from './i18n';

/** Home = the design's full-screen hero only (slideshow · name · lede · CTA); the footer follows. */
export function CarratHome() {
  const { tx } = useTx();
  return (
    <div className="cc-home">
      <section className="cc-hero">
        <div className="cc-hero__slides" aria-hidden="true">
          {[hero1, hero2, hero3].map((src) => (
            <div key={src} className="cc-hero__slide" style={{ backgroundImage: `url(${src})` }} />
          ))}
        </div>
        <div className="cc-hero__scrim" />
        <div className="cc-wrap cc-hero__inner">
          <h1>{tx('Carrat & Co.', 'كاررات آند كو')}</h1>
          <p className="cc-hero__lede">
            {tx(
              'Dive into our collection of premium lab-grown diamonds.',
              'انغمس في مجموعتنا من الألماس المخبري الفاخر.'
            )}
          </p>
          <div className="cc-hero__cta">
            <Link to="/diamonds" className="cc-btn cc-btn--solid">
              {tx('View the collection', 'تصفّح المجموعة')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
