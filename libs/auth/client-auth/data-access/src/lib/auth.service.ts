import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  Tokens,
  UserLoginData,
  UserPayload,
  UserRegistrationData,
} from '@fitmonitor/interfaces';
import { API_URL } from '@fitmonitor/consts';

@Injectable()
export class AuthService {
  private readonly http = inject(HttpClient);

  readonly user: WritableSignal<UserPayload | null> = signal(null);

  readonly baseUrl = `${API_URL}/auth`;

  getCurrentUser() {
    return this.http.get<UserPayload>(this.baseUrl);
  }

  signIn(payload: UserLoginData) {
    return this.http.post<Tokens>(`${this.baseUrl}/sign_in`, payload);
  }

  signUp(payload: UserRegistrationData) {
    return this.http.post<UserPayload>(`${this.baseUrl}/sign_up`, payload);
  }
}
