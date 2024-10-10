import { Navigation } from '@monotor/interfaces';
import { InjectionToken } from '@angular/core';
import { NAVIGATION as NAVIGATION_DATA } from '@monotor/consts';

export const NAVIGATION = new InjectionToken<Navigation[]>('NAVIGATION', {
  providedIn: 'root',
  factory: () =>
    NAVIGATION_DATA.map((nav) => {
      return {
        ...nav,
        showAfterAuth: nav.showAfterAuth ?? true,
        showBeforeAuth: nav.showBeforeAuth ?? true,
        adminOnly: nav.adminOnly ?? false,
      };
    }),
});
