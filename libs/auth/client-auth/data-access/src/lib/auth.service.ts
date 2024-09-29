import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { JwtHelperService } from '@auth0/angular-jwt';

import {
  StorageKeys,
  Tokens,
  UserLoginData,
  UserPayload,
  UserRegistrationData,
} from '@fitmonitor/interfaces';
import { API_URL } from '@fitmonitor/consts';
import { LocalStorageService } from '@fitmonitor/client-services';

@Injectable()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly jwtService = inject(JwtHelperService);
  private readonly localStorageService = inject(LocalStorageService);

  readonly user: WritableSignal<UserPayload | null> = signal(null);

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
  }

  setTokens(tokens: Tokens) {
    this.accessToken = tokens.access_token;
    this.refreshToken = tokens.refresh_token;
    this.user.set(this.jwtService.decodeToken(tokens.access_token));
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
    this.localStorageService.removeItem(StorageKeys.AccessToken);
    this.localStorageService.removeItem(StorageKeys.RefreshToken);
    this.user.set(null);
  }
}
