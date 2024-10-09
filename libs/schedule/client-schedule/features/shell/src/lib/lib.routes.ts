import { Route } from '@angular/router';
import { AuthGuards } from '@fitmonitor/data-access';

export const SCHEDULE_ROUTES: Route[] = [
  {
    path: '',
    canActivate: [AuthGuards.canActivateAuthenticated],
    loadComponent: () =>
      import('@fitmonitor/schedule/feature/base').then(
        (m) => m.ScheduleBaseComponent,
      ),
  },
];
