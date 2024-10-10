import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable, catchError, throwError } from 'rxjs';

import { API_URL } from '@monotor/consts';
import { ErrorResponse } from '@monotor/interfaces';
import { ApiService } from '@monotor/client-services';
import { Logger, LoggerSide } from '@monotor/util';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  private readonly apiService = inject(ApiService);

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((response: HttpErrorResponse) => {
        const isMonoTorServerRequest = req.url.includes(API_URL);
        if (
          !isMonoTorServerRequest ||
          response.error.message === 'Failed to fetch'
        ) {
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
