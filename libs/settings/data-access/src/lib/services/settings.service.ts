import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '@monotor/consts';
import { DeleteResposneSingleItem, User } from '@monotor/interfaces';

@Injectable()
export class SettingsService {
  private readonly http = inject(HttpClient);

  readonly baseUrl = `${API_URL}/auth`;

  updateNames(payload: Record<string, string>) {
    return this.http.patch<User>(`${this.baseUrl}/update`, payload);
  }

  updatePassword(payload: Record<string, string>) {
    return this.http.patch<User>(`${this.baseUrl}/change_password`, payload);
  }

  deleteUser() {
    return this.http.delete<DeleteResposneSingleItem>(`${this.baseUrl}/delete`);
  }
}
