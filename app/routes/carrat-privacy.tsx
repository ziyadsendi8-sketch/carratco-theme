// Carrat & Co. `/privacy` page — wired in via `app/routes.ts`.
import { createFileRoute } from '@tanstack/react-router';
import { InfoPage } from '../components/carrat/sections';

export const Route = createFileRoute('/{-$locale}/privacy')({
  head: ({ params }) => ({
    meta: [{ title: `${params.locale === 'en' ? 'Privacy Policy' : 'سياسة الخصوصية'} | Carrat & Co.` }],
  }),
  component: () => <InfoPage page="privacy" />,
});
