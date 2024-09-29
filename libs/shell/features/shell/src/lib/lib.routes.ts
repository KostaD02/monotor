import { Route } from '@angular/router';
import { AuthService } from '@fitmonitor/data-access';

import { ShellComponent } from './shell.component';

export const SHELL_ROUTES: Route[] = [
  {
    path: '',
    component: ShellComponent,
    providers: [AuthService],
    loadChildren: () => [
      {
        path: '',
        loadChildren: () =>
          import('@fitmonitor/home/feature/shell').then((m) => m.HOME_ROUTES),
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('@fitmonitor/client-auth/feature/shell').then(
            (m) => m.AUTH_ROUTES,
          ),
      },
      {
        path: '**',
        loadChildren: () =>
          import('@fitmonitor/notfound/feature/shell').then(
            (m) => m.NOTFOUND_ROUTES,
          ),
      },
    ],
  },
];
