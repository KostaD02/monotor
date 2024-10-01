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

export type MetricsFormData = Pick<Metrics, 'name' | 'desiredValue'>;
