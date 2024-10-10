import { Route } from '@angular/router';
import { AuthGuards } from '@monotor/data-access';

export const SCHEDULE_ROUTES: Route[] = [
  {
    path: '',
    canActivate: [AuthGuards.canActivateAuthenticated],
    loadComponent: () =>
      import('@monotor/schedule/feature/base').then(
        (m) => m.ScheduleBaseComponent,
      ),
  },
];
