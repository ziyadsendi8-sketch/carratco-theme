// Theme override for the home route, wired in via `app/routes.ts`.
// Keeps the engine loader / head (SEO, store data) but renders the Carrat home.
import { createFileRoute } from '@tanstack/react-router';
import { Home } from '@salla.sa/twilight-theme-engine/routes/home';
import type { HomeLoaderData } from '@salla.sa/twilight-theme-engine/routes/home';
import { withHead } from '@salla.sa/twilight-theme-engine/tanstack';
import { CarratHome } from '../components/carrat/CarratHome';

export const Route = createFileRoute('/{-$locale}/')({
  loader: ({ params }): Promise<HomeLoaderData> => Home.loader({ locale: params.locale }),
  head: withHead(Home),
  component: CarratHome,
});
