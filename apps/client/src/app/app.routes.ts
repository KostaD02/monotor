import { Route } from '@angular/router';

export const APP_ROUTES: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('@fitmonitor/shell/feature/shell').then((m) => m.SHELL_ROUTES),
  },
];
