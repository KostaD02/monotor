import { Route } from '@angular/router';

export const METRICS_ROUTES: Route[] = [
  {
    path: '',
    loadChildren: () => [
      {
        path: '',
        loadComponent: () =>
          import('@fitmonitor/client-metrics/feature/base').then(
            (m) => m.ClientMetricsComponent,
          ),
      },
    ],
  },
];
