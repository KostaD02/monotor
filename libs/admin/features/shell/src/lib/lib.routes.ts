import { Route } from '@angular/router';
import { AuthGuards } from '@fitmonitor/data-access';

export const ADMIN_ROUTES: Route[] = [
  {
    path: '',
    canActivate: [AuthGuards.canActivateAdmin],
    loadComponent: () =>
      import('@fitmonitor/admin/feature/base').then((m) => m.AdminComponent),
  },
];
