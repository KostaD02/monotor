import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { DatePipe } from '@angular/common';

import { LocalStorageService } from '@monotor/client-services';
import {
  Schedule,
  ScheduleCreatePayload,
  ScheduleDuplicatePayload,
  ScheduleUpdatePayload,
  Week,
} from '@monotor/interfaces';
import { ScheduleService } from '@monotor/schedule/data-access';

import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import {
  CREATE_SCHEDULE_DATA_FORM_INPUT,
  EDIT_SCHEDULE_DAWTA_FORM_INPUT,
  SCHEDULE_FORM_INPUT,
  WEEK_DAYS,
} from '@monotor/consts';
import { toCapitalisedCase } from '@monotor/util';
import { FormComponent } from '@monotor/shared/ui/form';
import { tap } from 'rxjs';

@Component({
  selector: 'monotor-schedule',
  standalone: true,
  imports: [
    NzAlertModule,
    NzModalModule,
    NzCardModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzToolTipModule,
    FormComponent,
    DatePipe,
  ],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleComponent implements OnChanges {
  @Input({ required: true }) schedule: Schedule | null = null;
  @Input() isPreview = false;
  @Output() deleted = new EventEmitter<void>();

  private readonly modalService = inject(NzModalService);
  private readonly scheduleService = inject(ScheduleService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly notificationService = inject(NzNotificationService);

  readonly weeks = WEEK_DAYS.map((day) => toCapitalisedCase(day));
  readonly updateItemScheduleFormData = SCHEDULE_FORM_INPUT;
  readonly addItemScheduleFormData = CREATE_SCHEDULE_DATA_FORM_INPUT;
  readonly editItemScheduleFormData = EDIT_SCHEDULE_DAWTA_FORM_INPUT;

  readonly showAddItemModal = signal(false);
  readonly showEditItemModal = signal(false);
  readonly showUpdateScheduleModal = signal(false);

  // TODO: 'scheduleData' change to signal input to avoid duplication data in component
  readonly scheduleData = signal<Schedule | null>(null);
  readonly renderSchedule = signal(true);
  readonly dataSchedule = computed(() =>
    this.convertScheduleDataToTableData(this.scheduleData()),
  );

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['schedule'] && changes['schedule'].currentValue) {
      const schedule = changes['schedule'].currentValue;
      this.refreshScheduleView(schedule);
    }
  }

  deleteSchedule(name: string) {
    this.modalService.confirm({
      nzTitle: 'Are you sure you want to delete this schedule?',
      nzContent: 'This action cannot be undone.',
      nzOnOk: () => {
        this.scheduleService.deleteSchedule(name).subscribe(() => {
          this.deleted.emit();
          this.notificationService.success(
            'Success',
            'Schedule deleted successfully.',
          );
        });
      },
    });
  }

  addScheduleItem(data: unknown) {
    if (!this.schedule) {
      return;
    }

    const { time, value } = data as ScheduleCreatePayload;

    const weekData = this.schedule.data;

    for (const key in weekData) {
      weekData[key as keyof typeof weekData][time] = value;
    }

    const payload: ScheduleDuplicatePayload = {
      duplicate: true,
      ...weekData,
    };

    this.scheduleService
      .modifySchedule(this.schedule.name, payload)
      .pipe(
        tap((schedule) => {
          this.notificationService.success(
            'Success',
            'Item added successfully.',
          );
          this.refreshScheduleView(schedule);
        }),
      )
      .subscribe();
  }

  handleEditItem(data: unknown) {
    if (!this.schedule) {
      return;
    }

    const { time, value, week } = data as ScheduleUpdatePayload;

    if (!WEEK_DAYS.includes(week.toLocaleLowerCase() as Week)) {
      this.notificationService.error(
        'Error',
        'Invalid week day. Correct: mon, tue, wed, thu, fri, sat, sun',
      );
      return;
    }

    const weekData = this.schedule.data;

    weekData[week as Week][time] = value;

    for (const day in weekData) {
      if (day === week) {
        continue;
      }
      if (!weekData[day as Week][time]) {
        weekData[day as Week][time] = '';
      }
    }

    const payload: ScheduleDuplicatePayload = {
      duplicate: false,
      ...weekData,
    };

    this.scheduleService
      .modifySchedule(this.schedule.name, payload)
      .pipe(
        tap((schedule) => {
          this.notificationService.success(
            'Success',
            'Item updated successfully.',
          );
          this.refreshScheduleView(schedule);
        }),
      )
      .subscribe();
  }

  updateSchedule(data: unknown) {
    if (!this.schedule) {
      return;
    }

    const { name } = data as { name: string };

    if (name === this.schedule.name) {
      this.notificationService.warning(
        'Warning',
        'Name should be different from the current one.',
      );
      return;
    }

    this.scheduleService
      .updateSchedule(this.schedule.name, name)
      .pipe(
        tap((schedule) => {
          this.notificationService.success(
            'Success',
            'Schedule name updated successfully.',
          );
          this.refreshScheduleView(schedule);
        }),
      )
      .subscribe();
  }

  deleteScheduleItem(time: string) {
    this.modalService.confirm({
      nzTitle: 'Are you sure you want to delete this schedule item?',
      nzContent: 'This action cannot be undone.',
      nzOnOk: () => {
        this.deleteItemFromSchedule(time);
      },
    });
  }

  private deleteItemFromSchedule(time: string) {
    const weekData = this.schedule?.data;

    for (const key in weekData) {
      delete weekData[key as keyof typeof weekData][time];
    }

    const payload: ScheduleDuplicatePayload = {
      duplicate: true,
      ...weekData,
    };

    this.scheduleService
      .modifySchedule(this.schedule?.name as string, payload)
      .pipe(
        tap((schedule) => {
          this.notificationService.success(
            'Success',
            'Item deleted successfully.',
          );
          this.refreshScheduleView(schedule);
        }),
      )
      .subscribe();
  }

  private refreshScheduleView(schedule: Schedule) {
    this.renderSchedule.set(false);
    this.schedule = schedule;
    this.scheduleData.set(schedule);
    this.renderSchedule.set(true);
  }

  private convertScheduleDataToTableData(schedule: Schedule | null) {
    if (!schedule) {
      return [];
    }

    const allTimes = new Set<string>();

    Object.values(schedule.data).forEach((day) => {
      Object.keys(day).forEach((time) => allTimes.add(time));
    });

    const times: string[] = Array.from(allTimes).sort();
    const data: string[][] = [];

    times.forEach((time) => {
      const row: string[] = [time];

      Object.values(schedule.data).forEach((day, dayIndex) => {
        row[dayIndex + 1] = day[time] || '';
      });

      data.push(row);
    });

    return data;
  }
}
