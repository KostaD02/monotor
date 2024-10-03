import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { API_URL } from '@fitmonitor/consts';
import { AuthService } from '@fitmonitor/data-access';
import { Calendar, CalendarData } from '@fitmonitor/interfaces';

@Injectable()
export class CalendarService {
  private readonly http = inject(HttpClient);

  private readonly authService = inject(AuthService);

  readonly baseUrl = `${API_URL}/calendar`;

  getAllCalendars() {
    if (!this.authService.user()) {
      return [];
    }
    return this.http.get<Calendar[]>(`${this.baseUrl}/all`);
  }

  getCalendarByName(name: string) {
    return this.http.get<Calendar>(`${this.baseUrl}/name/${name}`);
  }

  createCalendar(name: string) {
    return this.http.post<Calendar>(`${this.baseUrl}/create`, { name });
  }

  updateCalendar(name: string, newName: string) {
    return this.http.patch<Calendar>(`${this.baseUrl}/name/${name}`, {
      name: newName,
    });
  }

  updateCalendarData(name: string, data: Partial<CalendarData>) {
    return this.http.patch<Calendar>(`${this.baseUrl}/data/${name}`, data);
  }

  deleteAllCalendars() {
    return this.http.delete(`${this.baseUrl}/all`);
  }

  deleteCalendarByName(name: string) {
    return this.http.delete(`${this.baseUrl}/delete`, { body: { name } });
  }
}
