import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@fitmonitor/auth/client-auth/features/auth').then(
        (m) => m.AuthComponent,
      ),
  },
];
