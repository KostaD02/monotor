import { Routes } from '@angular/router';
import { AuthGuards } from '@fitmonitor/data-access';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    canActivate: [AuthGuards.canActivateUnauthenticated],
    loadComponent: () =>
      import('@fitmonitor/auth/client-auth/features/auth').then(
        (m) => m.AuthComponent,
      ),
  },
];
