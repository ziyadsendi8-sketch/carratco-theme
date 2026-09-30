// Carrat & Co. `/faq` page — wired in via `app/routes.ts`.
import { createFileRoute } from '@tanstack/react-router';
import { FaqPage } from '../components/carrat/sections';

export const Route = createFileRoute('/{-$locale}/faq')({
  head: ({ params }) => ({
    meta: [{ title: `${params.locale === 'en' ? 'FAQ' : 'الأسئلة الشائعة'} | Carrat & Co.` }],
  }),
  component: () => <FaqPage />,
});
