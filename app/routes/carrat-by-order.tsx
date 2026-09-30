// Carrat & Co. `/by-order` page — wired in via `app/routes.ts`.
import { createFileRoute } from '@tanstack/react-router';
import { ByOrderPage } from '../components/carrat/sections';

export const Route = createFileRoute('/{-$locale}/by-order')({
  head: ({ params }) => ({
    meta: [{ title: `${params.locale === 'en' ? 'By Order' : 'حسب الطلب'} | Carrat & Co.` }],
  }),
  component: () => <ByOrderPage />,
});
