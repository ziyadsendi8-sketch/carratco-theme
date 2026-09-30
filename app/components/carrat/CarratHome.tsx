import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { product as productApi } from '@salla.sa/twilight-theme-engine/api/product';
import type { Product } from '@salla.sa/twilight-theme-engine/types';
import hero1 from '../../assets/carrat/images/hero-1.webp';
import hero2 from '../../assets/carrat/images/hero-2.webp';
import hero3 from '../../assets/carrat/images/hero-3.webp';
import bespokeImg from '../../assets/carrat/images/bespoke.webp';
import { CarratCard } from './CarratCard';
import { SHAPES, shapeOf, isColoured, inCaratBand, type CaratBand } from './filters';
import { useTx } from './i18n';

export function CarratHero() {
  const { tx } = useTx();
  return (
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
          <a href="#collection" className="cc-btn cc-btn--solid">
            {tx('View the collection', 'تصفّح المجموعة')}
          </a>
        </div>
      </div>
    </section>
  );
}

type ColourFilter = 'all' | 'white' | 'colored';

export function CarratCollection() {
  const { tx } = useTx();
  const { data, isLoading } = useQuery(productApi.queries.list({ source: 'latest', perPage: 60 }));
  const products: Product[] = (data?.items as Product[]) ?? [];

  const [shape, setShape] = useState<string>('all');
  const [colour, setColour] = useState<ColourFilter>('all');
  const [carat, setCarat] = useState<CaratBand>('all');

  const presentShapes = useMemo(() => {
    const keys = new Set(products.map(shapeOf).filter(Boolean) as string[]);
    return SHAPES.filter((s) => keys.has(s.key));
  }, [products]);

  const shown = products.filter(
    (p) =>
      (shape === 'all' || shapeOf(p) === shape) &&
      (colour === 'all' || (colour === 'colored') === isColoured(p)) &&
      inCaratBand(p, carat)
  );

  const chip = (active: boolean, label: string, onClick: () => void, key?: string) => (
    <button key={key ?? label} type="button" className={`cc-chip${active ? ' is-active' : ''}`} onClick={onClick}>
      {label}
    </button>
  );

  return (
    <section className="cc-collection" id="collection">
      <div className="cc-wrap">
        <div className="cc-sec-head">
          <h2>{tx('The Collection', 'المجموعة')}</h2>
          <p>
            {tx(
              'Filter by shape, colour and carat. GIA or IGI on every stone.',
              'التصفية حسب الشكل واللون والقيراط. شهادة GIA أو IGI لكل ألماسة.'
            )}
          </p>
        </div>

        <div className="cc-filters">
          <div className="cc-filter-row">
            <span className="cc-filter-label">{tx('Shape', 'الشكل')}</span>
            {chip(shape === 'all', tx('All', 'الكل'), () => setShape('all'))}
            {presentShapes.map((s) => chip(shape === s.key, tx(s.en, s.ar), () => setShape(s.key), s.key))}
          </div>
          <div className="cc-filter-row">
            <span className="cc-filter-label">{tx('Colour', 'اللون')}</span>
            {chip(colour === 'all', tx('All', 'الكل'), () => setColour('all'))}
            {chip(colour === 'white', tx('White', 'أبيض'), () => setColour('white'))}
            {chip(colour === 'colored', tx('Colored', 'ملوّن'), () => setColour('colored'))}
          </div>
          <div className="cc-filter-row">
            <span className="cc-filter-label">{tx('Carat', 'القيراط')}</span>
            {chip(carat === 'all', tx('All', 'الكل'), () => setCarat('all'))}
            {chip(carat === 'u1', tx('Under 1 ct', 'أقل من ١ قيراط'), () => setCarat('u1'))}
            {chip(carat === '1-2', tx('1 – 2 ct', '١ – ٢ قيراط'), () => setCarat('1-2'))}
            {chip(carat === '2+', tx('2 ct +', '٢ قيراط فأكثر'), () => setCarat('2+'))}
          </div>
        </div>

        <div className="cc-count-line">
          {isLoading ? '…' : shown.length} {tx('stones', 'ألماسة')}
        </div>

        <div className="cc-grid">
          {shown.map((p) => (
            <CarratCard key={p.id} product={p} />
          ))}
          {!isLoading && !shown.length && (
            <div className="cc-empty">
              {tx('No stones match these filters.', 'لا توجد ألماسات مطابقة لهذه التصفية.')}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function CarratBand() {
  const { tx } = useTx();
  return (
    <section className="cc-band" id="labgrown">
      <div className="cc-wrap cc-band__inner">
        <div className="cc-eyebrow">{tx('Lab-Grown, Not Compromised', 'ألماس مخبري، دون تنازل')}</div>
        <p>
          {tx(
            'A lab-grown diamond is a real diamond — identical in chemistry, brilliance and hardness. You pay for the diamond, not the premium.',
            'الألماس المخبري ألماسٌ حقيقي — مطابقٌ في التركيب والبريق والصلابة. تدفع قيمة الألماس، لا المبالغة في السعر.'
          )}
        </p>
        <p className="cc-band__sub">
          {tx(
            'Every stone is graded on the same 4Cs and issued an independent GIA or IGI certificate, verifiable any time by its report number.',
            'كل ألماسٍ يُقيَّم بنفس معايير الـ 4Cs ويصدر له شهادة مستقلة من GIA أو IGI، يمكن التحقق منها في أي وقت عبر رقم التقرير.'
          )}
        </p>
      </div>
    </section>
  );
}

export function CarratBespoke() {
  const { tx } = useTx();
  const steps: [string, string][] = [
    ['Select and purchase your certified stone', 'اختر ألماستك الموثّقة واشترِها'],
    ['Share your vision — we advise on what suits it', 'شاركنا تصوّرك — ونرشدك لما يناسبه'],
    ['Receive a bespoke setting quotation', 'استلم عرض سعرٍ خاص للتركيب'],
  ];
  return (
    <section className="cc-bespoke" id="bespoke">
      <div className="cc-wrap cc-bespoke__inner">
        <div className="cc-bespoke__visual">
          <img src={bespokeImg} alt="" loading="lazy" />
        </div>
        <div>
          <h2>{tx('Made to your design', 'يُصنع على تصميمك')}</h2>
          <p>
            {tx(
              'Choose your diamond, and leave the setting to us. Contact us for a quotation.',
              'اختر ألماستك، ودع لنا مهمة تركيبها. تواصل معنا للحصول على عرض سعر.'
            )}
          </p>
          <div className="cc-src-note">
            {tx(
              "Can't find it here? We can source any size, shape or colour you want — even pieces not shown on the website.",
              'لم تجده هنا؟ نستطيع توفير أي حجم أو شكل أو لون ترغب به — حتى القطع غير المعروضة على الموقع.'
            )}
          </div>
          <ul className="cc-steps">
            {steps.map(([en, ar], i) => (
              <li key={en}>
                <span className="cc-steps__n">{i + 1}</span>
                <span>{tx(en, ar)}</span>
              </li>
            ))}
          </ul>
          <div className="cc-dual">
            <a className="cc-btn cc-btn--solid" href="https://instagram.com/carratandco" target="_blank" rel="noopener noreferrer">
              {tx('Inquire on Instagram', 'استفسر عبر إنستغرام')}
            </a>
            <a className="cc-btn" href="mailto:info@carratandco.com">
              {tx('Inquire by email', 'استفسر عبر البريد')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Carrat home: hero → collection (with shape/colour/carat chips) → lab-grown band → bespoke. */
export function CarratHome() {
  return (
    <div className="cc-home">
      <CarratHero />
      <CarratCollection />
      <CarratBand />
      <CarratBespoke />
    </div>
  );
}
