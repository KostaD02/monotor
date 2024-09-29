import { Navigation } from '@fitmonitor/interfaces';

export const NAVIGATION: Navigation[] = [
  {
    title: 'navigation.home',
    icon: 'home',
    routerLink: '/',
  },
  {
    title: 'navigation.auth',
    icon: 'lock',
    routerLink: '/auth',
    showAfterAuth: false,
  },
];
