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
        this.apiService.handleError(errorResponse);

        return throwError(() => errorResponse);
      }),
    );
  }
}
