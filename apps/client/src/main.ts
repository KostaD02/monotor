import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import {
  importProvidersFrom,
  LOCALE_ID,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
} from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { APP_ROUTES } from './app/app.routes';
import {
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
  HttpClient,
} from '@angular/common/http';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

import { en_US, ka_GE, NZ_I18N } from 'ng-zorro-antd/i18n';

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      APP_ROUTES,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
      }),
      withEnabledBlockingInitialNavigation()
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
      })
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
  ],
}).catch((err) => console.error(err));
