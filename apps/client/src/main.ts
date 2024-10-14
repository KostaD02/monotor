import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import {
  importProvidersFrom,
  inject,
  LOCALE_ID,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
} from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';

import { JwtModule } from '@auth0/angular-jwt';

import { HttpCustomInterceptor } from '@monotor/client-interceptors';
import { ApiService, LocalStorageService } from '@monotor/client-services';
import { StorageKeys } from '@monotor/interfaces';

import { en_US, ka_GE, NZ_I18N } from 'ng-zorro-antd/i18n';

import { APP_ROUTES } from './app/app.routes';
import { NzModalService } from 'ng-zorro-antd/modal';

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      APP_ROUTES,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
      }),
      withEnabledBlockingInitialNavigation(),
    ),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    provideAnimations(),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: () => {
            return inject(LocalStorageService).getItem(StorageKeys.AccessToken);
          },
        },
      }),
    ),
    {
      provide: NZ_I18N,
      useFactory: (localeId: string) => {
        switch (localeId) {
          case 'en':
            return en_US;
          case 'ka':
            return ka_GE;
          default:
            return en_US;
        }
      },
      deps: [LOCALE_ID],
    },
    NzModalService,
    ApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpCustomInterceptor,
      multi: true,
    },
  ],
}).catch((err) => console.error(err));
