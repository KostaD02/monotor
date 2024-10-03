import { Timestamps } from './timestamps';

export interface Metrics extends Timestamps {
  _id: string;
  name: string;
  ownerID: string;
  desiredValue: number;
  data: MetricsData[];
}

export interface MetricsData {
  _id: string;
  value: number;
  date: string;
  desiredValueReached: boolean;
}

export interface MetricsSingleFormData {
  value: number;
  date: string;
  time: string;
}

export interface MetricChartSelectData {
  _id: string;
  name: string;
  value: string;
  series: string;
}

export type MetricsFormData = Pick<Metrics, 'name' | 'desiredValue'>;
export type MetricsSingleData = Pick<MetricsData, 'value' | 'date'>;
