import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { BehaviorSubject, catchError, NEVER, switchMap, tap } from 'rxjs';

import { MetricComponent } from '@fitmonitor/metrics/client-metrics/features/ui/metric';
import {
  CREATE_ACTION_BUTTON,
  DELETE_ALL_ACTION_BUTTON,
  METRICS_FORM_DATA,
} from '@fitmonitor/consts';
import {
  Action,
  ActionTypes,
  ErrorResponse,
  MetricsFormData,
  StorageKeys,
} from '@fitmonitor/interfaces';
import { FormComponent } from '@fitmonitor/shared/ui/form';
import { Logger, LoggerSide } from '@fitmonitor/util';
import { MetricsService } from '@fitmonitor/client-metrics/data-access';

import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzLayoutComponent } from 'ng-zorro-antd/layout';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { LocalStorageService } from '@fitmonitor/client-services';

@Component({
  selector: 'fitmonitor-client-metrics',
  standalone: true,
  imports: [
    NzLayoutComponent,
    NzButtonComponent,
    NzModalModule,
    FormComponent,
    NzEmptyModule,
    MetricComponent,
  ],
  templateUrl: './client-metrics.component.html',
  styleUrl: './client-metrics.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientMetricsComponent {
  private readonly modalService = inject(NzModalService);
  private readonly metricsService = inject(MetricsService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly notificationService = inject(NzNotificationService);

  readonly ActionTypes = ActionTypes;

  readonly showCreateModal = signal(false);
  readonly showDeleteAllModal = signal(false);

  readonly createMetricsFormData = METRICS_FORM_DATA;

  readonly refershGetAll$ = new BehaviorSubject<void>(undefined);
  readonly allMetrics = toSignal(
    this.refershGetAll$.pipe(
      switchMap(() => this.metricsService.getAllMetrics()),
    ),
  );

  readonly buttonActions: Action[] = [
    CREATE_ACTION_BUTTON,
    DELETE_ALL_ACTION_BUTTON,
  ];

  handleAction(action: ActionTypes) {
    switch (action) {
      case ActionTypes.Create:
        this.showCreateModal.set(true);
        break;
      case ActionTypes.DeleteAll:
        if (this.allMetrics()?.length === 0) {
          this.notificationService.warning(
            'Warning',
            'There are no metrics to delete.',
          );
          break;
        }
        this.modalService.confirm({
          nzTitle: 'Are you sure you want to delete all metrics?',
          nzContent: 'This action cannot be undone.',
          nzOnOk: () => {
            this.handleDeleteAll();
          },
        });
        break;
      default:
        Logger.warn('Unknown action', LoggerSide.Client);
    }
  }

  handleCreateModal(data: unknown) {
    const { name, desiredValue } = data as MetricsFormData;
    this.metricsService
      .createMetrics({ name, desiredValue })
      .pipe(
        tap(() => {
          this.refershGetAll$.next();
        }),
        catchError((error: ErrorResponse) => {
          console.log(error);
          return NEVER;
        }),
      )
      .subscribe();
  }

  private handleDeleteAll() {
    this.metricsService
      .deleteAllMetrics()
      .pipe(
        tap((result) => {
          this.notificationService.success(
            'Success',
            `Successfully deleted ${result.deletedCount} metrics.`,
          );
          this.localStorageService.removeItem(StorageKeys.MetricView);
        }),
      )
      .subscribe();
  }
}
