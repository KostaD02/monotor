import { Route } from '@angular/router';

import { AuthGuards } from '@monotor/data-access';

export const METRICS_ROUTES: Route[] = [
  {
    path: '',
    loadChildren: () => [
      {
        path: '',
        canActivate: [AuthGuards.canActivateAuthenticated],
        loadComponent: () =>
          import('@monotor/client-metrics/feature/base').then(
            (m) => m.ClientMetricsComponent,
          ),
      },
    ],
  },
];
