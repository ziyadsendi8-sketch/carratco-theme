// Carrat & Co. `/diamonds` page — wired in via `app/routes.ts`.
import { createFileRoute } from '@tanstack/react-router';
import { DiamondsPage } from '../components/carrat/sections';

export const Route = createFileRoute('/{-$locale}/diamonds')({
  head: ({ params }) => ({
    meta: [{ title: `${params.locale === 'en' ? 'Diamonds' : 'الألماس'} | Carrat & Co.` }],
  }),
  component: () => <DiamondsPage />,
});
