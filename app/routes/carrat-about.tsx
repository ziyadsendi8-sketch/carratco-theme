// Carrat & Co. `/about` page — wired in via `app/routes.ts`.
import { createFileRoute } from '@tanstack/react-router';
import { InfoPage } from '../components/carrat/sections';

export const Route = createFileRoute('/{-$locale}/about')({
  head: ({ params }) => ({
    meta: [{ title: `${params.locale === 'en' ? 'About Us' : 'من نحن'} | Carrat & Co.` }],
  }),
  component: () => <InfoPage page="about" />,
});
