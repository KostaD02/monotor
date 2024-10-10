import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { BehaviorSubject, switchMap, tap } from 'rxjs';

import {
  CALENDAR_FORM_INPUT,
  CREATE_ACTION_BUTTON,
  DELETE_ALL_ACTION_BUTTON,
} from '@monotor/consts';
import { CalendarComponent } from '@monotor/calendar/client-calendar/features/ui/calendar';
import { CalendarService } from '@monotor/client-calendar/data-access';
import { FormComponent } from '@monotor/shared/ui/form';
import { ActionTypes, Action, CalendarForm } from '@monotor/interfaces';
import { Logger, LoggerSide } from '@monotor/util';

import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzLayoutComponent } from 'ng-zorro-antd/layout';

@Component({
  selector: 'monotor-client-calendar',
  standalone: true,
  imports: [
    NzLayoutComponent,
    NzButtonComponent,
    NzModalModule,
    NzEmptyModule,
    FormComponent,
    CalendarComponent,
  ],
  templateUrl: './client-calendar.component.html',
  styleUrl: './client-calendar.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientCalendarComponent {
  private readonly modalService = inject(NzModalService);
  private readonly calendarService = inject(CalendarService);
  private readonly notificationService = inject(NzNotificationService);

  readonly ActionTypes = ActionTypes;
  readonly calendarFormItems = CALENDAR_FORM_INPUT;

  readonly showCreateModal = signal(false);
  readonly showDeleteAllModal = signal(false);

  readonly refershGetAll$ = new BehaviorSubject<void>(undefined);
  readonly allCalendar = toSignal(
    this.refershGetAll$.pipe(
      switchMap(() => this.calendarService.getAllCalendars()),
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
        if (this.allCalendar()?.length === 0) {
          this.notificationService.warning(
            'Warning',
            'There are no calendars to delete.',
          );
          break;
        }
        this.modalService.confirm({
          nzTitle: 'Are you sure you want to delete all calendars?',
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

  handleCreateModel(data: unknown) {
    const { name } = data as CalendarForm;
    this.calendarService
      .createCalendar(name)
      .pipe(
        tap(() => {
          this.refershGetAll$.next();
        }),
      )
      .subscribe();
  }

  private handleDeleteAll() {
    this.calendarService
      .deleteAllCalendars()
      .pipe(
        tap((result) => {
          this.notificationService.success(
            'Success',
            `Successfully deleted ${result.deletedCount} calendar.`,
          );
          this.refershGetAll$.next();
        }),
      )
      .subscribe();
  }
}
