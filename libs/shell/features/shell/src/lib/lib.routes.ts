import { Route } from '@angular/router';
import ShellComponent from './shell.component';

export const SHELL_ROUTES: Route[] = [
  {
    path: '',
    component: ShellComponent,
    loadChildren: () => [],
  },
];
