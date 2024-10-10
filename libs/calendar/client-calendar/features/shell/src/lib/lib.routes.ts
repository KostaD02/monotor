import { Route } from '@angular/router';

import { AuthGuards } from '@monotor/data-access';

export const CALENDAR_ROUTES: Route[] = [
  {
    path: '',
    loadChildren: () => [
      {
        path: '',
        canActivate: [AuthGuards.canActivateAuthenticated],
        loadComponent: () =>
          import('@monotor/client-calendar/feature/base').then(
            (m) => m.ClientCalendarComponent,
          ),
      },
    ],
  },
];
