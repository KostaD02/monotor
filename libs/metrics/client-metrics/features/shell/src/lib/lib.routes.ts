import { Route } from '@angular/router';

import { AuthGuards } from '@fitmonitor/data-access';

export const METRICS_ROUTES: Route[] = [
  {
    path: '',
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
