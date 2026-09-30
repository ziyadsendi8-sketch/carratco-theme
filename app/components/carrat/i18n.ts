import { useTranslation } from '@salla.sa/twilight-theme-engine/i18n';

/** Tiny bilingual helper: pick the EN or AR copy for the current storefront locale. */
export function useTx() {
  const { locale } = useTranslation();
  const isAr = (locale || '').toLowerCase().startsWith('ar');
  return { isAr, tx: (en: string, ar: string) => (isAr ? ar : en) };
}
