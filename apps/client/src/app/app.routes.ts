import { Route } from '@angular/router';

export const APP_ROUTES: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('@monotor/shell/feature/shell').then((m) => m.SHELL_ROUTES),
  },
];
