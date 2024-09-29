import { Route } from '@angular/router';
import ShellComponent from './shell.component';
import { AuthService } from '@fitmonitor/data-access';

export const SHELL_ROUTES: Route[] = [
  {
    path: '',
    component: ShellComponent,
    loadChildren: () => [],
    providers: [AuthService],
  },
];
