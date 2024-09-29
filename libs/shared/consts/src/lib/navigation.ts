import { Navigation } from '@fitmonitor/interfaces';

export const NAVIGATION: Navigation[] = [
  {
    title: 'navigation.home',
    icon: 'home',
    link: '/',
  },
  {
    title: 'navigation.auth',
    icon: 'lock',
    link: '/auth',
    showAfterAuth: false,
  },
];
