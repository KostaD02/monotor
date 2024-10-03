import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { API_URL } from '@fitmonitor/consts';
import {
  DeleteResponse,
  DeleteResposneSingleItem,
  Metrics,
  MetricsFormData,
  MetricsSingleData,
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

  createMetricData(name: string, body: MetricsSingleData) {
    return this.http.post<Metrics>(`${this.baseUrl}/add-data/${name}`, body);
  }

  updateMetric(name: string, body: Partial<MetricsFormData>) {
    return this.http.patch<Metrics>(`${this.baseUrl}/update/${name}`, body);
  }

  updateMetricData(name: string, id: string, body: Partial<MetricsSingleData>) {
    return this.http.patch<Metrics>(
      `${this.baseUrl}/update-data/${name}/${id}`,
      body,
    );
  }

  deleteAllMetrics() {
    return this.http.delete<DeleteResponse>(`${this.baseUrl}/all`);
  }

  deleteMetricsByName(name: string) {
    return this.http.delete<DeleteResposneSingleItem>(
      `${this.baseUrl}/delete`,
      { body: { name } },
    );
  }

  deleteMetricData(name: string, id: string) {
    return this.http.delete<Metrics>(
      `${this.baseUrl}/delete-data/${name}/${id}`,
    );
  }
}
