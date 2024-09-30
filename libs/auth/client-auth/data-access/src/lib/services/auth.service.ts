import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { JwtHelperService } from '@auth0/angular-jwt';

import {
  ErrorResponse,
  StorageKeys,
  Tokens,
  UserLoginData,
  UserPayload,
  UserRegistrationData,
  UserRole,
} from '@fitmonitor/interfaces';
import { API_URL, RETRY_AUTH_CHECK } from '@fitmonitor/consts';
import { LocalStorageService } from '@fitmonitor/client-services';
import { catchError, filter, NEVER, switchMap, tap, timer } from 'rxjs';
import { Logger, LoggerSide } from '@fitmonitor/util';

@Injectable()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly jwtService = inject(JwtHelperService);
  private readonly localStorageService = inject(LocalStorageService);

  readonly user: WritableSignal<UserPayload | null> = signal(null);

  readonly checkAuthorizedUser = timer(0, RETRY_AUTH_CHECK).pipe(
    tap(() => {
      if (this.accessToken && !this.refreshToken) {
        this.removeTokens();
      }
    }),
    filter(
      () =>
        this.user() !== null ||
        this.accessToken !== null ||
        this.refreshToken !== null,
    ),
    switchMap(() => this.getCurrentUser()),
    tap((user) => {
      if (user) {
        this.user.set(user);
      }
    }),
    catchError((error: ErrorResponse) => {
      if (
        error.errorKeys.includes('errors.token_expired') &&
        this.refreshToken
      ) {
        this.handleRefresh();
        Logger.info('Accces token expired, refreshing...', LoggerSide.Client);
        return NEVER;
      }
      this.removeTokens();
      return NEVER;
    }),
  );

  readonly baseUrl = `${API_URL}/auth`;

  get accessToken() {
    return this.localStorageService.getItem(StorageKeys.AccessToken);
  }

  set accessToken(token: string) {
    this.localStorageService.setItem(StorageKeys.AccessToken, token);
  }

  get refreshToken() {
    return this.localStorageService.getItem(StorageKeys.RefreshToken);
  }

  set refreshToken(token: string) {
    this.localStorageService.setItem(StorageKeys.RefreshToken, token);
  }

  constructor() {
    this.init();
  }

  private init() {
    if (this.accessToken && this.isValidToken(this.accessToken)) {
      this.user.set(this.jwtService.decodeToken(this.accessToken));
    }
    this.checkAuthorizedUser.subscribe();
  }

  setTokens(tokens: Tokens) {
    this.accessToken = tokens.access_token;
    this.refreshToken = tokens.refresh_token;
    this.user.set(this.jwtService.decodeToken(tokens.access_token));
  }

  removeTokens() {
    this.localStorageService.removeItem(StorageKeys.AccessToken);
    this.localStorageService.removeItem(StorageKeys.RefreshToken);
  }

  handleRefresh() {
    this.http
      .post<Pick<Tokens, 'access_token'>>(`${this.baseUrl}/refresh`, {
        refresh_token: this.refreshToken,
      })
      .pipe(
        tap((token) => {
          this.accessToken = token.access_token;
        }),
        catchError(() => {
          this.signOut();
          this.router.navigate(['/auth']);
          return NEVER;
        }),
      )
      .subscribe();
  }

  getCurrentUser() {
    return this.http.get<UserPayload>(this.baseUrl);
  }

  signIn(payload: UserLoginData) {
    return this.http.post<Tokens>(`${this.baseUrl}/sign_in`, payload);
  }

  signUp(payload: UserRegistrationData) {
    return this.http.post<UserPayload>(`${this.baseUrl}/sign_up`, payload);
  }

  isValidToken(token: string) {
    return !this.jwtService.isTokenExpired(token);
  }

  signOut() {
    this.removeTokens();
    this.user.set(null);
  }

  // guards

  canActivateAuthenticated() {
    const token = this.accessToken;

    if (!token || !this.isValidToken(token)) {
      this.router.navigate(['/auth']);
      return false;
    }

    return true;
  }

  canActivateUnauthenticated() {
    const token = this.accessToken;

    if (token || this.isValidToken(token)) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }

  canActivateAdmin() {
    const token = this.accessToken;

    if (!token || !this.isValidToken(token)) {
      this.router.navigate(['/auth']);
      return false;
    }

    const user = this.jwtService.decodeToken(token);

    if (!user || user.roles !== UserRole.Admin) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
