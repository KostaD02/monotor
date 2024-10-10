import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '@monotor/consts';
import { AuthService } from '@monotor/data-access';
import { DeleteResposneSingleItem, User } from '@monotor/interfaces';

@Injectable()
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  readonly baseUrl = `${API_URL}/auth`;

  getAllUsers() {
    return this.http.get<User[]>(`${this.baseUrl}/all`);
  }

  modifyUser(id: string, data: Record<string, string | boolean>) {
    return this.http.patch<User>(`${this.baseUrl}/update/${id}`, data);
  }

  deleteUser(id: string) {
    return this.http.delete<DeleteResposneSingleItem>(
      `${this.baseUrl}/delete/${id}`,
    );
  }
}
