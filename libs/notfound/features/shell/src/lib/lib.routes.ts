import { Route } from '@angular/router';

export const NOTFOUND_ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('@monotor/notfound/feature/base').then((m) => m.NotfoundComponent),
  },
];
