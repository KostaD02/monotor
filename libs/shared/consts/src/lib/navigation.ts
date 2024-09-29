import { Navigation } from '@fitmonitor/interfaces';

export const NAVIGATION: Navigation[] = [
  {
    title: 'Home',
    icon: 'home',
    routerLink: '/',
  },
  {
    title: 'Auth',
    icon: 'lock',
    routerLink: '/auth',
    showAfterAuth: false,
  },
];
