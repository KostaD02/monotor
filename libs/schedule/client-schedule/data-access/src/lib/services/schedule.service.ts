import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '@monotor/consts';
import { AuthService } from '@monotor/data-access';
import {
  DeleteResponse,
  DeleteResposneSingleItem,
  Schedule,
  ScheduleDuplicatePayload,
} from '@monotor/interfaces';
import { of } from 'rxjs';

@Injectable()
export class ScheduleService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  readonly baseUrl = `${API_URL}/schedule`;

  getAllSchedules() {
    if (!this.authService.user()) {
      return of([]);
    }

    return this.http.get<Schedule[]>(`${this.baseUrl}/all`);
  }

  getScheduleByName(name: string) {
    return this.http.get<Schedule>(`${this.baseUrl}/get/${name}`);
  }

  createSchedule(name: string) {
    return this.http.post<Schedule>(`${this.baseUrl}/create`, {
      name,
    });
  }

  modifySchedule(name: string, payload: ScheduleDuplicatePayload) {
    return this.http.patch<Schedule>(`${this.baseUrl}/modify/${name}`, payload);
  }

  updateSchedule(name: string, newName: string) {
    return this.http.patch<Schedule>(`${this.baseUrl}/update/${name}`, {
      name: newName,
    });
  }

  clearSchedule(name: string) {
    return this.http.patch<Schedule>(`${this.baseUrl}/clear/${name}`, {});
  }

  deleteSchedule(name: string) {
    return this.http.delete<DeleteResposneSingleItem>(
      `${this.baseUrl}/delete/${name}`,
    );
  }

  deleteAllSchedules() {
    return this.http.delete<DeleteResponse>(`${this.baseUrl}/all`);
  }
}
