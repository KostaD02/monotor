import { Route } from '@angular/router';
import { AuthGuards } from '@fitmonitor/data-access';

export const SETTINGS_ROUTES: Route[] = [
  {
    path: '',
    canActivate: [AuthGuards.canActivateAuthenticated],
    loadComponent: () =>
      import('@fitmonitor/settings/feature/base').then(
        (m) => m.SettingsComponent,
      ),
  },
];
