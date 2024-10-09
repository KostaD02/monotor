import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { FormComponent } from '@fitmonitor/shared/ui/form';
import { ScheduleService } from '@fitmonitor/schedule/data-access';
import { Logger, LoggerSide } from '@fitmonitor/util';
import { ScheduleComponent } from '@fitmonitor/schedule/client-schedule/features/ui/schedule';
import { SCHEDULE_FORM_INPUT } from '@fitmonitor/consts';

import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzLayoutComponent } from 'ng-zorro-antd/layout';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { Action, ActionTypes } from '@fitmonitor/interfaces';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import {
  CREATE_ACTION_BUTTON,
  DELETE_ALL_ACTION_BUTTON,
} from '@fitmonitor/consts';

@Component({
  selector: 'fitmonitor-schedule-base',
  standalone: true,
  imports: [
    NzLayoutComponent,
    NzButtonComponent,
    NzModalModule,
    FormComponent,
    NzEmptyModule,
    ScheduleComponent,
    FormComponent,
  ],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleBaseComponent {
  private readonly modalService = inject(NzModalService);
  private readonly scheduleService = inject(ScheduleService);
  private readonly notificationService = inject(NzNotificationService);

  readonly ActionTypes = ActionTypes;

  readonly showCreateModal = signal(false);
  readonly showDeleteAllModal = signal(false);

  readonly createScheduleFormData = SCHEDULE_FORM_INPUT;

  readonly refershGetAll$ = new BehaviorSubject<void>(undefined);
  readonly allSchedule = toSignal(
    this.refershGetAll$.pipe(
      switchMap(() => this.scheduleService.getAllSchedules()),
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
        if (this.allSchedule()?.length === 0) {
          this.notificationService.warning(
            'Warning',
            'There are no schedules to delete.',
          );
          break;
        }
        this.modalService.confirm({
          nzTitle: 'Are you sure you want to delete all schedule?',
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
    const { name } = data as { name: string };
    this.scheduleService
      .createSchedule(name)
      .pipe(
        tap(() => {
          this.notificationService.success('Success', 'Successfully created.');
          this.refershGetAll$.next();
        }),
      )
      .subscribe();
  }

  private handleDeleteAll() {
    this.scheduleService
      .deleteAllSchedules()
      .pipe(
        tap((result) => {
          this.notificationService.success(
            'Success',
            `Successfully deleted ${result.deletedCount} schedules.`,
          );
        }),
      )
      .subscribe();
  }
}
