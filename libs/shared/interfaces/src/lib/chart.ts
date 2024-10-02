export interface ChartMetric {
  name: string;
  series: Record<string, string>[];
}

export interface ChartMetricReference {
  name: string;
  value: string | number;
}
