import { Route } from '@angular/router';
import { AuthGuards } from '@monotor/data-access';

export const SETTINGS_ROUTES: Route[] = [
  {
    path: '',
    canActivate: [AuthGuards.canActivateAuthenticated],
    loadComponent: () =>
      import('@monotor/settings/feature/base').then((m) => m.SettingsComponent),
  },
];
