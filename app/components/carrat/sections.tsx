import { useMemo, useState } from 'react';
import type { Product } from '@salla.sa/twilight-theme-engine/types';
import bespokeImg from '../../assets/carrat/images/bespoke.webp';
import { CarratCard } from './CarratCard';
import { SHAPES, shapeOf, isColoured, inCaratBand, type CaratBand } from './filters';
import { groupKey, specFor } from './catalog';
import { toArDigits } from './format';
import { FAQ, INFO, BY_ORDER } from './content';
import { useStones } from './useStones';
import { useTx } from './i18n';

const IG = 'https://instagram.com/carratandco';
const MAIL = 'mailto:info@carratandco.com';

export function InquireButtons({ solidFirst = true }: { solidFirst?: boolean }) {
  const { tx } = useTx();
  return (
    <div className="cc-dual">
      <a className={`cc-btn${solidFirst ? ' cc-btn--solid' : ''}`} href={IG} target="_blank" rel="noopener noreferrer">
        {tx('Inquire on Instagram', 'استفسر عبر إنستغرام')}
      </a>
      <a className="cc-btn" href={MAIL}>
        {tx('Inquire by email', 'استفسر عبر البريد')}
      </a>
    </div>
  );
}

/* ------------------------------------------------------------------ Collection */
type ColourFilter = 'all' | 'white' | 'colored';
interface Listing {
  key: string;
  product: Product;
  group?: Product[];
}

export function CarratCollection() {
  const { tx, isAr } = useTx();
  const { products, isLoading } = useStones();
  const [shape, setShape] = useState('all');
  const [colour, setColour] = useState<ColourFilter>('all');
  const [carat, setCarat] = useState<CaratBand>('all');

  // Group same-shape stones the design sells as one listing (Round → "from 699").
  const listings = useMemo<Listing[]>(() => {
    const out: Listing[] = [];
    const groups = new Map<string, Product[]>();
    for (const p of products) {
      const g = groupKey(p);
      if (g) {
        if (!groups.has(g)) {
          groups.set(g, []);
          out.push({ key: `g-${g}`, product: p, group: groups.get(g) });
        }
        groups.get(g)!.push(p);
      } else out.push({ key: String(p.id), product: p });
    }
    for (const l of out) {
      if (l.group) {
        l.group.sort((a, b) => (specFor(a).ct ?? 0) - (specFor(b).ct ?? 0));
        l.product = l.group[0];
      }
    }
    return out;
  }, [products]);

  const presentShapes = useMemo(() => {
    const keys = new Set(products.map(shapeOf).filter(Boolean) as string[]);
    return SHAPES.filter((s) => keys.has(s.key));
  }, [products]);

  const shown = listings.filter((l) => {
    const members = l.group ?? [l.product];
    return members.some(
      (p) =>
        (shape === 'all' || shapeOf(p) === shape) &&
        (colour === 'all' || (colour === 'colored') === isColoured(p)) &&
        inCaratBand(p, carat)
    );
  });

  const chip = (active: boolean, label: string, onClick: () => void, key?: string) => (
    <button key={key ?? label} type="button" className={`cc-chip${active ? ' is-active' : ''}`} onClick={onClick}>
      {label}
    </button>
  );
  const count = isLoading ? '…' : isAr ? toArDigits(String(shown.length)) : shown.length;

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
          {count} {tx('stones', 'ألماسة')}
        </div>
        <div className="cc-grid">
          {shown.map((l) => (
            <CarratCard key={l.key} product={l.product} group={l.group} />
          ))}
          {!isLoading && !shown.length && (
            <div className="cc-empty">
              {tx('No stones match. Try a different filter.', 'لا توجد أحجار مطابقة.')}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Lab-grown band */
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

/* ------------------------------------------------------------------ Bespoke */
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
                <span className="cc-steps__n">{tx(String(i + 1), toArDigits(String(i + 1)))}</span>
                <span>{tx(en, ar)}</span>
              </li>
            ))}
          </ul>
          <InquireButtons />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ FAQ */
export function CarratFaq() {
  const { tx, isAr } = useTx();
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="cc-faq" id="faq">
      <div className="cc-wrap">
        <div className="cc-sec-head">
          <h2>{tx('Frequently Asked Questions', 'الأسئلة الشائعة')}</h2>
        </div>
        <div className="cc-acc">
          {FAQ.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q_en} className={`cc-qa${isOpen ? ' is-open' : ''}`}>
                <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : i)}>
                  <span>{isAr ? f.q_ar : f.q_en}</span>
                  <span className="cc-qa__plus" aria-hidden="true">+</span>
                </button>
                <div className="cc-qa__ans" hidden={!isOpen}>
                  <p>{isAr ? f.a_ar : f.a_en}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ By Order */
const boImgs = import.meta.glob('../../assets/carrat/byorder/*.webp', {
  eager: true,
  import: 'default',
}) as Record<string, string>;
const boImg = (slug: string) => boImgs[`../../assets/carrat/byorder/${slug}.webp`];

export function CarratByOrder() {
  const { tx, isAr } = useTx();
  const [tab, setTab] = useState<'all' | 'diamonds' | 'rtw'>('all');
  const tabBtn = (key: typeof tab, en: string, ar: string) => (
    <button type="button" className={tab === key ? 'is-active' : ''} onClick={() => setTab(key)}>
      {tx(en, ar)}
    </button>
  );
  return (
    <div className="cc-byorder">
      <div className="cc-sec-head">
        <h2>{tx('By Order', 'حسب الطلب')}</h2>
      </div>
      <p className="cc-bo-intro">
        {tx(
          'Made-to-order fancy-colour diamonds and ready-to-wear pieces, sourced to your specification. Every stone available from 1 to 10 carats.',
          'ألماس ملوّن فاخر وقطع جاهزة للارتداء، تُجهّز حسب طلبك. كل ألماسة متوفرة من ١ إلى ١٠ قيراط.'
        )}
      </p>
      <div className="cc-bo-tabs">
        {tabBtn('all', 'All', 'الكل')}
        {tabBtn('diamonds', 'Diamonds', 'الألماس')}
        {tabBtn('rtw', 'Ready to Wear', 'جاهز للارتداء')}
      </div>
      {tab !== 'rtw' &&
        BY_ORDER.map((g) => (
          <div key={g.en} className="cc-bo-group">
            <h3 className="cc-bo-color">{isAr ? g.ar : g.en}</h3>
            <div className="cc-bo-grid">
              {g.cards.map((c) => (
                <a key={c.slug} className="cc-bo-card" href={IG} target="_blank" rel="noopener noreferrer">
                  <div className="cc-bo-thumb">
                    <img loading="lazy" src={boImg(c.slug)} alt={isAr ? c.ar : c.en} />
                  </div>
                  <div className="cc-bo-name">{isAr ? c.ar : c.en}</div>
                  <div className="cc-bo-ct">{isAr ? c.ctAr : c.ctEn}</div>
                  <div className="cc-bo-dm">{tx('DM to inquire', 'راسلنا للطلب')}</div>
                </a>
              ))}
            </div>
          </div>
        ))}
      {tab !== 'diamonds' && (
        <div className="cc-bo-rtw-empty">
          {tx(
            'Ready-to-wear pieces coming soon — message us for a preview.',
            'قطع جاهزة للارتداء قريبًا — راسلنا للاطلاع عليها.'
          )}
        </div>
      )}
      <div className="cc-bo-cta">
        <p>{tx('Every piece is made by order. Message us to begin.', 'كل قطعة تُصنع حسب الطلب. راسلنا للبدء.')}</p>
        <InquireButtons />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Info pages */
export type InfoKey = 'about' | 'education' | 'privacy' | 'returns';
export function CarratInfo({ page }: { page: InfoKey }) {
  const { isAr } = useTx();
  return (
    <div
      className="cc-info"
      // Theme-authored copy from the approved design (content.ts), not user input.
      dangerouslySetInnerHTML={{ __html: isAr ? INFO[page].ar : INFO[page].en }}
    />
  );
}

/* ------------------------------------------------------------------ Page shells */
export function DiamondsPage() {
  return (
    <div className="cc-page">
      <CarratCollection />
      <CarratBand />
    </div>
  );
}
export const BespokePage = () => (
  <div className="cc-page">
    <CarratBespoke />
  </div>
);
export const FaqPage = () => (
  <div className="cc-page">
    <CarratFaq />
  </div>
);
export const ByOrderPage = () => (
  <div className="cc-page">
    <CarratByOrder />
  </div>
);
export const InfoPage = ({ page }: { page: InfoKey }) => (
  <div className="cc-page">
    <CarratInfo page={page} />
  </div>
);
