import { Route } from '@angular/router';
import { MetricsService } from '@fitmonitor/client-metrics/data-access';

export const HOME_ROUTES: Route[] = [
  {
    path: '',
    providers: [MetricsService],
    loadComponent: () =>
      import('@fitmonitor/home/feature/base').then((m) => m.HomeComponent),
  },
];
