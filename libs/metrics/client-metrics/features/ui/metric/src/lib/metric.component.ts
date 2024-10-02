import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnChanges,
  signal,
  computed,
  SimpleChanges,
  WritableSignal,
  OnInit,
} from '@angular/core';
import { DatePipe, DOCUMENT } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

import { fromEvent, map, startWith } from 'rxjs';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import {
  ChartMetric,
  ChartMetricReference,
  Metrics,
  MetricsData,
  StorageKeys,
} from '@fitmonitor/interfaces';
import { avarage, convertToTime, findMode } from '@fitmonitor/util';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAlertComponent } from 'ng-zorro-antd/alert';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { LocalStorageService } from '@fitmonitor/client-services';

@Component({
  selector: 'fitmonitor-metric',
  standalone: true,
  imports: [
    NzAlertComponent,
    NzCardModule,
    NzIconModule,
    NzButtonModule,
    NgxChartsModule,
    NzTableModule,
    NzToolTipModule,
    NzEmptyModule,
    DatePipe,
  ],
  templateUrl: './metric.component.html',
  styleUrl: './metric.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricComponent implements OnInit, OnChanges {
  @Input({ required: true }) metric: Metrics | null = null;

  private readonly document = inject(DOCUMENT);
  private readonly localStorageService = inject(LocalStorageService);

  readonly chartSize = toSignal(
    fromEvent(this.document.defaultView as Window, 'resize').pipe(
      map((event) => (event.target as Window).innerWidth - 100),
      startWith(this.document.body.clientWidth - 100),
      map((size) => `${size}px`),
    ),
  );

  readonly isChartPreview = signal(true);
  readonly charReferenceLines: WritableSignal<ChartMetricReference[]> = signal(
    [],
  );
  readonly chartData: WritableSignal<ChartMetric[]> = signal([]);

  readonly renderChart = computed(
    () =>
      this.charReferenceLines().length !== 0 && this.chartData().length !== 0,
  );

  ngOnInit() {
    this.setMetricView();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['metric'] && changes['metric'].currentValue) {
      const metric = changes['metric'].currentValue;
      this.chartData.set([
        {
          name: metric.name,
          series: metric.data.map((item: MetricsData) => {
            return {
              _id: item._id,
              name: `${new Date(item.date).toLocaleDateString()} ${convertToTime(item.date)}`,
              value: item.value,
            };
          }),
        },
      ]);

      const numbers = metric.data.map((item: MetricsData) => item.value);
      const avg = avarage(numbers);
      const mode = findMode(numbers);

      if (!isNaN(avg) && !isNaN(mode)) {
        this.charReferenceLines.set([
          {
            name: 'Avarage',
            value: avg,
          },
          {
            name: 'Mode',
            value: mode,
          },
          {
            name: 'Desired',
            value: metric.desiredValue,
          },
          {
            name: 'Max',
            value: Math.max(...numbers),
          },
          {
            name: 'Min',
            value: Math.min(...numbers),
          },
        ]);
      }
    }
  }

  onSelect(id: string) {
    console.log(id);
  }

  updateMetric(id: string) {
    console.log(id);
  }

  deleteMetric(id: string) {
    console.log(id);
  }

  updateMetricView() {
    this.isChartPreview.set(!this.isChartPreview());
    const previousView =
      this.localStorageService.getItem(StorageKeys.MetricView) || [];

    if (!this.isChartPreview()) {
      previousView.push(this.metric?._id);
      this.localStorageService.setItem(StorageKeys.MetricView, previousView);
    } else {
      this.localStorageService.setItem(
        StorageKeys.MetricView,
        previousView.filter((id: string) => id !== this.metric?._id),
      );
    }
  }

  private setMetricView() {
    const metricView = this.localStorageService.getItem(StorageKeys.MetricView);

    if (!metricView) {
      return;
    }

    this.isChartPreview.set(!metricView.includes(this.metric?._id));
  }
}
