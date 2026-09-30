/** The design's main navigation, in order. `to` is a theme route; `contact` scrolls to the footer. */
export const NAV: { to: string; en: string; ar: string }[] = [
  { to: '/about', en: 'About', ar: 'من نحن' },
  { to: '/education', en: 'Education', ar: 'تعرّف' },
  { to: '/diamonds', en: 'Diamonds', ar: 'الألماس' },
  { to: '/bespoke', en: 'Bespoke', ar: 'تصميم خاص' },
  { to: '/by-order', en: 'By Order', ar: 'حسب الطلب' },
  { to: '/faq', en: 'FAQ', ar: 'الأسئلة' },
  { to: '#contact', en: 'Contact', ar: 'تواصل' },
];

export const FOOTER_COMPANY: { to: string; en: string; ar: string }[] = [
  { to: '/about', en: 'About Us', ar: 'من نحن' },
  { to: '/education', en: 'Education', ar: 'تعرّف على الألماس' },
  { to: '/by-order', en: 'By Order', ar: 'حسب الطلب' },
  { to: '/privacy', en: 'Privacy Policy', ar: 'سياسة الخصوصية' },
  { to: '/returns', en: 'Return & Refund Policy', ar: 'سياسة الاسترجاع والاستبدال' },
];

export function scrollToContact(e?: { preventDefault: () => void }) {
  e?.preventDefault();
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
}
