import { Route } from '@angular/router';

export const NOTFOUND_ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('@fitmonitor/notfound/feature/base').then(
        (m) => m.NotfoundComponent,
      ),
  },
];
