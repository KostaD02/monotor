import { Navigation } from '@monotor/interfaces';

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
  {
    title: 'Metrics',
    icon: 'line-chart',
    routerLink: '/metrics',
    showBeforeAuth: false,
  },
  {
    title: 'Calendar',
    icon: 'calendar',
    routerLink: '/calendar',
    showBeforeAuth: false,
  },
  {
    title: 'Schedule',
    icon: 'table',
    routerLink: '/schedule',
    showBeforeAuth: false,
  },
  {
    title: 'Admin',
    icon: 'control',
    routerLink: '/admin',
    showBeforeAuth: false,
    adminOnly: true,
  },
  {
    title: 'Settings',
    icon: 'setting',
    routerLink: '/settings',
    showBeforeAuth: false,
  },
];
