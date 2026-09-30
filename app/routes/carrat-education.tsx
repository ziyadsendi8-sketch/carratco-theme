// Carrat & Co. `/education` page — wired in via `app/routes.ts`.
import { createFileRoute } from '@tanstack/react-router';
import { InfoPage } from '../components/carrat/sections';

export const Route = createFileRoute('/{-$locale}/education')({
  head: ({ params }) => ({
    meta: [{ title: `${params.locale === 'en' ? 'Education' : 'تعرّف على الألماس'} | Carrat & Co.` }],
  }),
  component: () => <InfoPage page="education" />,
});
