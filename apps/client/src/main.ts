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
  HttpClient,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { JwtModule } from '@auth0/angular-jwt';

import { HttpErrorInterceptor } from '@fitmonitor/client-interceptors';
import { LocalStorageService } from '@fitmonitor/client-services';
import { StorageKeys } from '@fitmonitor/interfaces';
import { API_DOMAIN } from '@fitmonitor/consts';

import { en_US, ka_GE, NZ_I18N } from 'ng-zorro-antd/i18n';

import { APP_ROUTES } from './app/app.routes';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

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
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      }),
      JwtModule.forRoot({
        config: {
          tokenGetter: () => {
            return inject(LocalStorageService).getItem(StorageKeys.AccessToken);
          },
          // TODO: use environment variable
          allowedDomains: [API_DOMAIN],
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
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
  ],
}).catch((err) => console.error(err));
