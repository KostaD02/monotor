import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Input,
  OnChanges,
  Output,
  EventEmitter,
  signal,
  SimpleChanges,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { tap } from 'rxjs';

import { CalendarService } from '@fitmonitor/client-calendar/data-access';
import {
  Calendar,
  CalendarData,
  CalendarDataForm,
  CalendarForm,
} from '@fitmonitor/interfaces';
import { isAllValueEmpty, toCapitalisedCase } from '@fitmonitor/util';

import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCalendarMode, NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import {
  CALENDAR_DATA_FORM_INPUT,
  CALENDAR_FORM_INPUT,
} from '@fitmonitor/consts';
import { FormComponent } from '@fitmonitor/shared/ui/form';

@Component({
  selector: 'fitmonitor-calendar',
  standalone: true,
  imports: [
    NzCardModule,
    NzTableModule,
    NzIconModule,
    NzButtonModule,
    NzCalendarModule,
    NzToolTipModule,
    NzModalModule,
    NzAlertModule,
    FormsModule,
    FormComponent,
    DatePipe,
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnChanges {
  @Input({ required: true }) calendar: Calendar | null = null;
  @Input() isPreview = false;
  @Output() deleted = new EventEmitter<void>();

  private readonly calendarService = inject(CalendarService);
  private readonly modalService = inject(NzModalService);
  private readonly notificationService = inject(NzNotificationService);

  readonly currentDate = signal(new Date());
  readonly mode: WritableSignal<NzCalendarMode> = signal('month');
  readonly showCalendar = signal(true);
  readonly renderCalendar = signal(true);

  readonly calendarFormItems = CALENDAR_FORM_INPUT;
  readonly calendarFormDataItems = CALENDAR_DATA_FORM_INPUT;

  date = this.currentDate();

  readonly selectedDateTitle = signal('');
  readonly selectedDateDescription = signal('');

  readonly showWeekEdit = signal('');
  readonly showEditCalendarName = signal(false);

  readonly tableData = computed(() => {
    if (!this.currentDate() || !this.calendar) {
      return [];
    }

    const data = this.calendar.data as unknown as Record<string, string>;

    return Object.keys(data).map((key) => ({
      key: toCapitalisedCase(key),
      value: data[key],
    }));
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['calendar']) {
      this.currentDate.set(new Date());
      this.date = this.currentDate();
      this.selectChange(this.date);
    }
  }

  selectChange(date: Date): void {
    if (!this.calendar) {
      return;
    }

    const daysOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const dayOfWeek = daysOfWeek[date.getDay()];
    const data = this.calendar.data as unknown as Record<string, string>;
    const result = data[dayOfWeek];

    const isOlderDate = date < new Date();

    this.selectedDateTitle.set(
      `On selected date (${date.toLocaleDateString()}), you ${isOlderDate ? 'had' : 'have'}: "<b>${result || 'Nothing'}</b>"`,
    );

    if (isAllValueEmpty(data)) {
      this.selectedDateDescription.set(
        'You have not set any data for the calendar',
      );
      return;
    }

    const settedData = Object.keys(data).filter((key) => data[key]);
    this.selectedDateDescription.set(
      `You have set data for the following days: ${settedData.join(', ')}. <br /> ${settedData.map((key) => `<b>${toCapitalisedCase(key)}</b>: ${data[key]}`).join(', ')}`,
    );
  }

  deleteCalendar() {
    this.modalService.confirm({
      nzTitle: `'Are you sure you want to delete "${this.calendar?.name}" calendar?`,
      nzContent: 'This action cannot be undone.',
      nzOnOk: () => {
        if (!this.calendar) {
          return;
        }
        this.calendarService
          .deleteCalendarByName(this.calendar.name)
          .pipe(
            tap((result) => {
              if (result.acknowledged) {
                this.notificationService.success(
                  'Success',
                  `Successfully deleted ${this.calendar?.name}.`,
                );
                this.deleted.emit();
              }
            }),
          )
          .subscribe();
      },
    });
  }

  handleEditCalendar(data: unknown) {
    if (!this.calendar) {
      return;
    }

    const { name } = data as CalendarForm;

    this.calendarService
      .updateCalendar(this.calendar.name, name)
      .pipe(
        tap((result) => {
          this.refreshCalendarView(result);
          this.notificationService.success(
            'Success',
            `Successfully updated calendar name to ${result.name}.`,
          );
        }),
      )
      .subscribe();
  }

  handleEditCalendarData(data: unknown, day: string) {
    if (!this.calendar) {
      return;
    }

    day = day.toLowerCase();

    const { value } = data as CalendarDataForm;

    const body: Partial<CalendarData> = {};

    if (day === 'mon') {
      body.mon = value;
    } else if (day === 'tue') {
      body.tue = value;
    } else if (day === 'wed') {
      body.wed = value;
    } else if (day === 'thu') {
      body.thu = value;
    } else if (day === 'fri') {
      body.fri = value;
    } else if (day === 'sat') {
      body.sat = value;
    } else if (day === 'sun') {
      body.sun = value;
    }

    this.calendarService
      .updateCalendarData(this.calendar.name, body)
      .pipe(
        tap((result) => {
          this.refreshCalendarView(result);
          this.notificationService.success(
            'Success',
            `Successfully updated ${toCapitalisedCase(day)} to ${value || 'Nothing'}.`,
          );
        }),
      )
      .subscribe();
  }

  private refreshCalendarView(calendar: Calendar) {
    this.renderCalendar.set(false);
    this.calendar = calendar;
    this.currentDate.set(new Date());
    this.date = this.currentDate();
    this.selectChange(this.date);
    this.renderCalendar.set(true);
  }
}
