import { useQuery } from '@tanstack/react-query';
import { SallaSocial } from '@salla.sa/twilight-components-react/social';
import { SallaPayments } from '@salla.sa/twilight-components-react/payments';
import { useTwilight } from '@salla.sa/twilight-theme-engine/providers';
import { Link } from '@salla.sa/twilight-theme-engine/common';
import { HookSlot } from '@salla.sa/twilight-theme-engine/hooks';
import { menu } from '@salla.sa/twilight-theme-engine/api/menu';
import type { MenuItem } from '@salla.sa/twilight-theme-engine/types';
import logoUrl from '../../assets/carrat/images/logo.webp';
import { useTx } from './i18n';

/**
 * Carrat & Co. footer — four columns (brand · contact · company · details),
 * then copyright + the shipping line. "Company" links come from the store's
 * **footer menu**; payment marks come from the store's enabled methods.
 * Per brand rules there is no VAT / tax block here.
 */
export function CarratFooter() {
  const { store } = useTwilight();
  const { tx } = useTx();
  const { data: footerItems = [] } = useQuery({
    queryKey: ['carrat', 'menu', 'footer'],
    queryFn: () => menu.footer(),
  });
  const year = new Date().getFullYear();

  return (
    <footer className="cc-footer" id="contact" suppressHydrationWarning>
      <HookSlot name="footer:start" />
      <div className="cc-wrap">
        <div className="cc-fcols">
          <div className="cc-fcol cc-fcol--brand">
            <img className="cc-flogo" src={logoUrl} alt="Carrat & Co." width={160} height={22} />
            <p className="cc-lead">
              {tx(
                'Lab-grown diamonds, chosen with intention. Independently certified and securely shipped.',
                'ألماس مخبري يُختار بعناية. موثّق بشهادات مستقلة ويُشحن بأمان.'
              )}
            </p>
            <SallaSocial className="cc-social" />
          </div>

          <div className="cc-fcol">
            <h4>{tx('Contact', 'تواصل')}</h4>
            <a href="mailto:info@carratandco.com">info@carratandco.com</a>
            <a href="https://instagram.com/carratandco" target="_blank" rel="noopener noreferrer">
              @carratandco
            </a>
            <span>
              {tx(
                'Certificate numbers on request via IG DM',
                'أرقام الشهادات متاحة عند الطلب عبر رسائل إنستغرام'
              )}
            </span>
          </div>

          <div className="cc-fcol">
            <h4>{tx('Company', 'الشركة')}</h4>
            {(footerItems as MenuItem[])
              .filter((i) => i?.title)
              .map((item, i) => (
                <Link key={`${item.id}-${i}`} to={item.url}>
                  {item.title}
                </Link>
              ))}
          </div>

          <div className="cc-fcol">
            <h4>{tx('Details', 'التفاصيل')}</h4>
            <span>{tx('Carrat & Co. Ltd.', 'كاررات آند كو')}</span>
            <span>
              {tx('Commercial Registration No.:', 'رقم السجل التجاري:')} 7055186071
            </span>
            <div className="cc-pay">
              <SallaPayments />
            </div>
          </div>
        </div>

        <div className="cc-fbottom">
          <span>
            © {year} {store?.name || 'Carrat & Co.'}. {tx('All rights reserved.', 'جميع الحقوق محفوظة.')}
          </span>
          <span>
            {tx('All prices are in SAR and include shipping.', 'جميع الأسعار بالريال السعودي وتشمل الشحن.')}
          </span>
        </div>
      </div>
      <HookSlot name="footer:end" />
    </footer>
  );
}
