import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouterState } from '@tanstack/react-router';
import { useIsHome } from '@salla.sa/twilight-theme-engine/providers';
import { useHydrated } from '../common/useHydrated';
import { SallaCartSummary } from '@salla.sa/twilight-components-react/cart-summary';
import { SallaUserMenu } from '@salla.sa/twilight-components-react/user-menu';
import { SallaSearch } from '@salla.sa/twilight-components-react/search';
import { useTwilight } from '@salla.sa/twilight-theme-engine/providers';
import { Link } from '@salla.sa/twilight-theme-engine/common';
import { HookSlot } from '@salla.sa/twilight-theme-engine/hooks';
import { menu } from '@salla.sa/twilight-theme-engine/api/menu';
import type { MenuItem } from '@salla.sa/twilight-theme-engine/types';
import logoUrl from '../../assets/carrat/images/logo.webp';
import { useTx } from './i18n';

/**
 * Carrat & Co. header — fixed bar, logo left, uppercase serif nav centre,
 * language pill + cart right. Transparent over the home hero, solid navy
 * once the page scrolls (or on every non-home page).
 *
 * Nav items come from the store's **header menu** (Dashboard → Menus), so the
 * merchant controls order and links. Below 900px the nav collapses into a
 * full-screen overlay menu behind the hamburger.
 */
export function CarratHeader() {
  const { store } = useTwilight();
  const { tx, isAr } = useTx();
  const { data: items = [] } = useQuery(menu.queries.header());
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHomeRoute = useIsHome();
  const hydrated = useHydrated();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.classList.toggle('cc-noscroll', open);
  }, [open]);

  const multilingual = !!store?.settings?.is_multilingual || !!store?.settings?.currencies_enabled;
  const openLang = () => window.salla?.event?.dispatch('localization::open');
  // Transparent over the home hero until scrolled; solid everywhere else.
  const homePath = /^(\/dev-[^/]+)?(\/[a-z]{2})?\/?$/.test(pathname);
  const solid = scrolled || (hydrated && !isHomeRoute && !homePath);

  const navItems = (items as MenuItem[]).filter((i) => i?.title);

  return (
    <>
      <header className={`cc-header${solid ? ' is-solid' : ''}`} suppressHydrationWarning>
        <HookSlot name="header:start" />
        <div className="cc-wrap cc-bar">
          <Link to="/" className="cc-brand" aria-label={store?.name || 'Carrat & Co.'}>
            <img className="cc-logo" src={logoUrl} alt="Carrat & Co." width={176} height={24} />
          </Link>

          <nav className="cc-nav" aria-label={tx('Main menu', 'القائمة الرئيسية')}>
            <ul>
              {navItems.map((item, i) => (
                <li key={`${item.id}-${i}`}>
                  <Link to={item.url}>{item.title}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="cc-tools">
            {multilingual && (
              <button type="button" className="cc-lang" onClick={openLang}>
                {isAr ? 'English' : 'العربية'}
              </button>
            )}
            <SallaUserMenu avatarOnly relativeDropdown className="cc-user" />
            <SallaCartSummary className="cc-cart">
              <span slot="icon" className="cc-cart__label">
                {tx('Cart', 'السلة')}
              </span>
            </SallaCartSummary>
            <button
              type="button"
              className={`cc-hamburger${open ? ' is-open' : ''}`}
              aria-label={tx('Menu', 'القائمة')}
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
        <SallaSearch suppressHydrationWarning />
        <HookSlot name="header:end" />
      </header>

      <div className={`cc-mobile-menu${open ? ' is-open' : ''}`} aria-hidden={!open}>
        <button
          type="button"
          className="cc-mobile-menu__close"
          aria-label={tx('Close', 'إغلاق')}
          onClick={() => setOpen(false)}
        >
          &times;
        </button>
        <img className="cc-mobile-menu__logo" src={logoUrl} alt="" />
        {navItems.map((item, i) => (
          <Link key={`${item.id}-${i}`} to={item.url} onClick={() => setOpen(false)}>
            {item.title}
          </Link>
        ))}
        {multilingual && (
          <button type="button" className="cc-lang cc-mobile-menu__lang" onClick={openLang}>
            {isAr ? 'English' : 'العربية'}
          </button>
        )}
      </div>
    </>
  );
}
