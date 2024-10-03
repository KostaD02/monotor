export interface ChartMetric {
  name: string;
  series: Record<string, string | number | boolean>[];
}

export interface ChartMetricReference {
  name: string;
  value: string | number;
}
