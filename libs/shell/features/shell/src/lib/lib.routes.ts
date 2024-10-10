import { Route } from '@angular/router';
import { AuthService } from '@monotor/data-access';

import { ShellComponent } from './shell.component';
import { MetricsService } from '@monotor/client-metrics/data-access';
import { CalendarService } from '@monotor/client-calendar/data-access';
import { AdminService } from '@monotor/admin/data-access';
import { ScheduleService } from '@monotor/schedule/data-access';
import { SettingsService } from '@monotor/settings/data-access';

export const SHELL_ROUTES: Route[] = [
  {
    path: '',
    component: ShellComponent,
    providers: [
      AuthService,
      MetricsService,
      CalendarService,
      ScheduleService,
      AdminService,
      SettingsService,
    ],
    loadChildren: () => [
      {
        path: '',
        loadChildren: () =>
          import('@monotor/home/feature/shell').then((m) => m.HOME_ROUTES),
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('@monotor/client-auth/feature/shell').then(
            (m) => m.AUTH_ROUTES,
          ),
      },
      {
        path: 'metrics',
        loadChildren: () =>
          import('@monotor/client-metrics/feature/shell').then(
            (m) => m.METRICS_ROUTES,
          ),
      },
      {
        path: 'calendar',
        loadChildren: () =>
          import('@monotor/client-calendar/feature/shell').then(
            (m) => m.CALENDAR_ROUTES,
          ),
      },
      {
        path: 'schedule',
        loadChildren: () =>
          import('@monotor/schedule/feature/shell').then(
            (m) => m.SCHEDULE_ROUTES,
          ),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('@monotor/settings/feature/shell').then(
            (m) => m.SETTINGS_ROUTES,
          ),
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('@monotor/admin/feature/shell').then((m) => m.ADMIN_ROUTES),
      },
      {
        path: '**',
        loadChildren: () =>
          import('@monotor/notfound/feature/shell').then(
            (m) => m.NOTFOUND_ROUTES,
          ),
      },
    ],
  },
];
