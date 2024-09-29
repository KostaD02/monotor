import { Route } from '@angular/router';

export const HOME_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('@fitmonitor/home/feature/base').then((m) => m.HomeComponent),
  },
];
