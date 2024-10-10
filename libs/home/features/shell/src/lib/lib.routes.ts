import { Route } from '@angular/router';
import { MetricsService } from '@monotor/client-metrics/data-access';

export const HOME_ROUTES: Route[] = [
  {
    path: '',
    providers: [MetricsService],
    loadComponent: () =>
      import('@monotor/home/feature/base').then((m) => m.HomeComponent),
  },
];
