import { Route } from '@angular/router';

import { AuthGuards } from '@fitmonitor/data-access';

export const CALENDAR_ROUTES: Route[] = [
  {
    path: '',
    loadChildren: () => [
      {
        path: '',
        canActivate: [AuthGuards.canActivateAuthenticated],
        loadComponent: () =>
          import('@fitmonitor/client-calendar/feature/base').then(
            (m) => m.ClientCalendarComponent,
          ),
      },
    ],
  },
];
