// Carrat & Co. `/bespoke` page — wired in via `app/routes.ts`.
import { createFileRoute } from '@tanstack/react-router';
import { BespokePage } from '../components/carrat/sections';

export const Route = createFileRoute('/{-$locale}/bespoke')({
  head: ({ params }) => ({
    meta: [{ title: `${params.locale === 'en' ? 'Bespoke' : 'تصميم خاص'} | Carrat & Co.` }],
  }),
  component: () => <BespokePage />,
});
