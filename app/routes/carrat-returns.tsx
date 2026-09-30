// Carrat & Co. `/returns` page — wired in via `app/routes.ts`.
import { createFileRoute } from '@tanstack/react-router';
import { InfoPage } from '../components/carrat/sections';

export const Route = createFileRoute('/{-$locale}/returns')({
  head: ({ params }) => ({
    meta: [{ title: `${params.locale === 'en' ? 'Return & Refund Policy' : 'سياسة الاسترجاع'} | Carrat & Co.` }],
  }),
  component: () => <InfoPage page="returns" />,
});
