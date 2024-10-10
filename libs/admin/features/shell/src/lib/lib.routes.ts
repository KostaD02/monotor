import { Route } from '@angular/router';
import { AuthGuards } from '@monotor/data-access';

export const ADMIN_ROUTES: Route[] = [
  {
    path: '',
    canActivate: [AuthGuards.canActivateAdmin],
    loadComponent: () =>
      import('@monotor/admin/feature/base').then((m) => m.AdminComponent),
  },
];
