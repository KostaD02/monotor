import { Route } from '@angular/router';

import { AuthGuards } from '@fitmonitor/data-access';
import { MetricsService } from '@fitmonitor/client-metrics/data-access';

export const METRICS_ROUTES: Route[] = [
  {
    path: '',
    providers: [MetricsService],
    loadChildren: () => [
      {
        path: '',
        canActivate: [AuthGuards.canActivateAuthenticated],
        loadComponent: () =>
          import('@fitmonitor/client-metrics/feature/base').then(
            (m) => m.ClientMetricsComponent,
          ),
      },
    ],
  },
];
