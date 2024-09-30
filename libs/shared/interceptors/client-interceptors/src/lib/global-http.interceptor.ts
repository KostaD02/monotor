import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable, catchError, throwError } from 'rxjs';

import { API_URL } from '@fitmonitor/consts';
import { ErrorResponse } from '@fitmonitor/interfaces';
import { ApiService } from '@fitmonitor/client-services';
import { Logger, LoggerSide } from '@fitmonitor/util';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  private readonly apiService = inject(ApiService);

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((response: HttpErrorResponse) => {
        const isFitMonitorServerRequest = req.url.includes(API_URL);

        if (!isFitMonitorServerRequest) {
          return throwError(() => response);
        }

        const errorResponse = response.error as ErrorResponse;

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
