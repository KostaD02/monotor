import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable, catchError, throwError } from 'rxjs';

import { ErrorResponse, StorageKeys } from '@monotor/interfaces';
import { ApiService, LocalStorageService } from '@monotor/client-services';
import { Logger, LoggerSide } from '@monotor/util';

@Injectable()
export class HttpCustomInterceptor implements HttpInterceptor {
  private readonly apiService = inject(ApiService);
  private readonly localStorageService = inject(LocalStorageService);

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    let apiURL = this.localStorageService.getItem(StorageKeys.ServerAPIUrl);

    if (!apiURL) {
      const url = prompt(
        'Please enter your IP with server port\nFor example: 192.168.1.6:2201',
      );
      this.localStorageService.setItem(StorageKeys.ServerAPIUrl, url);
      apiURL = url;
    }

    const requset = req.clone({
      url: `http://${apiURL}/${req.url.slice(req.url.search('api'))}`,
      setHeaders: {
        Authorization: `Bearer ${this.localStorageService.getItem(StorageKeys.AccessToken)}`,
      },
    });

    return next.handle(requset).pipe(
      catchError((response: HttpErrorResponse) => {
        const error = new Error(response.error);

        // ? Little workaround to set server API URL dynamically
        // TODO: Refactor this part to pass the server API URL from the environment

        if (error.message.includes('Failed to fetch')) {
          alert(
            'Prompted IP is not correct, please try again Or server is down',
          );
          this.localStorageService.removeItem('serverAPIUrl');
          location.reload();
          return throwError(() => response);
        }

        const errorResponse = response.error as ErrorResponse;

        if (!errorResponse?.errorKeys || !errorResponse?.error) {
          return throwError(() => response);
        }

        if (errorResponse.errorKeys.includes('errors.token_expired')) {
          return throwError(() => errorResponse);
        }

        this.apiService.handleError(errorResponse);

        Logger.error(
          `Error on API request, at ${errorResponse.path}, reason: ${errorResponse.error}, status: ${errorResponse.statusCode}, keys: ${errorResponse.errorKeys}`,
          LoggerSide.Client,
        );

        return throwError(() => errorResponse);
      }),
    );
  }
}
