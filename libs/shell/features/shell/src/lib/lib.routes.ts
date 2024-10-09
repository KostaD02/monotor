import { Route } from '@angular/router';
import { AuthService } from '@fitmonitor/data-access';

import { ShellComponent } from './shell.component';
import { MetricsService } from '@fitmonitor/client-metrics/data-access';
import { CalendarService } from '@fitmonitor/client-calendar/data-access';
import { AdminService } from '@fitmonitor/admin/data-access';

export const SHELL_ROUTES: Route[] = [
  {
    path: '',
    component: ShellComponent,
    providers: [AuthService, MetricsService, CalendarService, AdminService],
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
        path: 'metrics',
        loadChildren: () =>
          import('@fitmonitor/client-metrics/feature/shell').then(
            (m) => m.METRICS_ROUTES,
          ),
      },
      {
        path: 'calendar',
        loadChildren: () =>
          import('@fitmonitor/client-calendar/feature/shell').then(
            (m) => m.CALENDAR_ROUTES,
          ),
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('@fitmonitor/admin/feature/shell').then((m) => m.ADMIN_ROUTES),
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
