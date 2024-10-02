import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { API_URL } from '@fitmonitor/consts';
import {
  DeleteResponse,
  Metrics,
  MetricsFormData,
} from '@fitmonitor/interfaces';

@Injectable()
export class MetricsService {
  private readonly http = inject(HttpClient);

  readonly baseUrl = `${API_URL}/metrics`;

  getAllMetrics() {
    return this.http.get<Metrics[]>(`${this.baseUrl}/all`);
  }

  getMetricsByName(name: string) {
    return this.http.get<Metrics>(`${this.baseUrl}/name/${name}`);
  }

  createMetrics(data: MetricsFormData) {
    return this.http.post<Metrics>(`${this.baseUrl}/add`, data);
  }

  deleteAllMetrics() {
    return this.http.delete<DeleteResponse>(`${this.baseUrl}/all`);
  }
}
