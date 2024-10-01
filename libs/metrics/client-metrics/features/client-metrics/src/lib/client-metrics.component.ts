import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
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
} from '@fitmonitor/interfaces';
import { FormComponent } from '@fitmonitor/shared/ui/form';
import { Logger, LoggerSide } from '@fitmonitor/util';
import { MetricsService } from '@fitmonitor/client-metrics/data-access';

import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzLayoutComponent } from 'ng-zorro-antd/layout';
import { BehaviorSubject, catchError, NEVER, switchMap, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'fitmonitor-client-metrics',
  standalone: true,
  imports: [
    FormComponent,
    NzLayoutComponent,
    NzButtonComponent,
    NzModalModule,
    FormComponent,
    JsonPipe,
    AsyncPipe,
  ],
  templateUrl: './client-metrics.component.html',
  styleUrl: './client-metrics.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientMetricsComponent {
  private readonly metricsService = inject(MetricsService);
  readonly ActionTypes = ActionTypes;

  readonly showCreateModal = signal(false);
  readonly showDeleteAllModal = signal(false);

  readonly createMetricsFormData = METRICS_FORM_DATA;

  readonly refershGetAll$ = new BehaviorSubject<void>(undefined);
  readonly getAll = toSignal(
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
        this.handleCreate();
        break;
      case ActionTypes.DeleteAll:
        this.handleDeleteAll();
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
        tap((response) => {
          console.log(response);
          this.refershGetAll$.next();
        }),
        catchError((error: ErrorResponse) => {
          console.log(error);
          return NEVER;
        }),
      )
      .subscribe();
  }

  private handleCreate() {
    this.showCreateModal.set(true);
    this.showDeleteAllModal.set(false);
  }

  private handleDeleteAll() {
    this.showDeleteAllModal.set(true);
    this.showCreateModal.set(false);
  }
}
