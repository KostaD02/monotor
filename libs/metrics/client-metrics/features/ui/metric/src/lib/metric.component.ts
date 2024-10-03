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
  Output,
  EventEmitter,
} from '@angular/core';
import { DatePipe, JsonPipe } from '@angular/common';

import { tap } from 'rxjs';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import {
  ChartMetric,
  ChartMetricReference,
  MetricChartSelectData,
  Metrics,
  MetricsData,
  MetricsFormData,
  MetricsSingleData,
  MetricsSingleFormData,
  StorageKeys,
} from '@fitmonitor/interfaces';
import {
  avarage,
  concatDateAndTime,
  convertToTime,
  findMode,
  isAllValueEmpty,
} from '@fitmonitor/util';
import { LocalStorageService } from '@fitmonitor/client-services';
import { FormComponent } from '@fitmonitor/shared/ui/form';
import {
  METRIC_EDIT_FORM_DATA,
  METRIC_ITEM_UPDATE_FORM_DATA,
  METRICS_ITEM_FORM_DATA,
} from '@fitmonitor/consts';
import { MetricsService } from '@fitmonitor/client-metrics/data-access';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAlertComponent } from 'ng-zorro-antd/alert';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'fitmonitor-metric',
  standalone: true,
  imports: [
    NzAlertComponent,
    NzCardModule,
    NzIconModule,
    NzButtonModule,
    NzTableModule,
    NzToolTipModule,
    NzEmptyModule,
    NzModalModule,
    NgxChartsModule,
    FormComponent,
    DatePipe,
    JsonPipe,
  ],
  templateUrl: './metric.component.html',
  styleUrl: './metric.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricComponent implements OnInit, OnChanges {
  @Input({ required: true }) metric: Metrics | null = null;
  @Output() deleted = new EventEmitter<void>();

  private readonly modalService = inject(NzModalService);
  private readonly metricService = inject(MetricsService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly notificationService = inject(NzNotificationService);

  readonly addItemsForm = METRICS_ITEM_FORM_DATA;
  readonly updateItemForm = METRIC_ITEM_UPDATE_FORM_DATA;
  readonly editItemForm = METRIC_EDIT_FORM_DATA;

  readonly showUpdateMetricModal = signal('');
  readonly showCreateMetricModal = signal(false);
  readonly showEditMetricModal = signal(false);
  readonly showChartMetricModal: WritableSignal<MetricChartSelectData | null> =
    signal(null);

  readonly renderMetric = signal(false);
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
      this.setMetricData(metric);
      this.renderMetric.set(true);
    }
  }

  onSelect(data: MetricChartSelectData) {
    this.showChartMetricModal.set(data);
  }

  deleteDialog(id: string) {
    this.modalService.confirm({
      nzTitle: 'Are you sure you want to delete this metric data?',
      nzContent: 'This action cannot be undone.',
      nzOnOk: () => {
        this.deleteMetricById(id);
      },
    });
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

  onMetricDataAdd(data: unknown) {
    const { value, date, time } = data as MetricsSingleFormData;
    const concatedDate = concatDateAndTime(date, time);

    this.metricService
      .createMetricData(this.metric?.name || '', {
        value,
        date: concatedDate,
      })
      .pipe(
        tap((metric) => {
          this.notificationService.success(
            'Success',
            'Metric data added successfully',
          );
          this.refreshMetricView(metric);
        }),
      )
      .subscribe();
  }

  onMetricDataUpdate(data: unknown, id: string) {
    if (isAllValueEmpty(data as Record<string, unknown>)) {
      return;
    }

    const { value, date, time } = data as MetricsSingleFormData;

    const body: Partial<MetricsSingleData> = {};

    if (value) {
      body.value = value;
    }

    if (date && time) {
      body.date = concatDateAndTime(date, time);
    } else if (date) {
      body.date = new Date(date).toISOString();
    } else if (time) {
      body.date = new Date(
        `${new Date().toLocaleDateString()} ${time}`,
      ).toISOString();
    }

    this.metricService
      .updateMetricData(this.metric?.name || '', id, body)
      .pipe(
        tap((metric) => {
          this.notificationService.success(
            'Success',
            'Metric data updated successfully',
          );
          this.refreshMetricView(metric);
        }),
      )
      .subscribe();
  }

  editMetric(data: unknown) {
    const { name, desiredValue } = data as MetricsFormData;

    if (!name && !desiredValue) {
      return;
    }

    const body: Partial<MetricsFormData> = {};

    if (name) {
      body.name = name;
    }

    if (desiredValue) {
      body.desiredValue = desiredValue;
    }

    this.metricService
      .updateMetric(this.metric?.name || '', body)
      .pipe(
        tap((metric) => {
          this.notificationService.success(
            'Success',
            'Metric deleted successfully',
          );
          this.refreshMetricView(metric);
        }),
      )
      .subscribe();
  }

  deleteMetric() {
    this.modalService.confirm({
      nzTitle: 'Are you sure you want to delete this metric?',
      nzContent: 'This action cannot be undone.',
      nzOnOk: () => {
        this.metricService
          .deleteMetricsByName(this.metric?.name || '')
          .pipe(
            tap(() => {
              this.notificationService.success(
                'Success',
                'Metric deleted successfully',
              );
              this.deleted.emit();
            }),
          )
          .subscribe();
      },
    });
  }

  private setMetricData(metric: Metrics) {
    this.chartData.set([
      {
        name: metric.name,
        series: metric.data.map((item: MetricsData, index: number) => {
          const date = new Date(item.date);
          const time = `${date.toLocaleDateString()} ${convertToTime(item.date)}`;
          return {
            date: time,
            name: `${index + 1}`,
            _id: item._id,
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

  private setMetricView() {
    const metricView = this.localStorageService.getItem(StorageKeys.MetricView);

    if (!metricView) {
      return;
    }

    this.isChartPreview.set(!metricView.includes(this.metric?._id));
  }

  private deleteMetricById(id: string) {
    this.metricService
      .deleteMetricData(this.metric?.name || '', id)
      .pipe(
        tap(() => {
          this.notificationService.success(
            'Success',
            'Metric deleted successfully',
          );
          this.deleted.emit();
        }),
      )
      .subscribe();
  }

  private refreshMetricView(metric: Metrics) {
    this.renderMetric.set(false);
    this.metric = metric;
    this.setMetricData(metric);
    this.renderMetric.set(true);
  }
}
