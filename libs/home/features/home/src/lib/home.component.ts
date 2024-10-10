import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

import { filter, forkJoin, map, switchMap } from 'rxjs';

import { MetricsService } from '@fitmonitor/client-metrics/data-access';
import { MetricComponent } from '@fitmonitor/metrics/client-metrics/features/ui/metric';
import { CalendarService } from '@fitmonitor/client-calendar/data-access';
import { CalendarComponent } from '@fitmonitor/calendar/client-calendar/features/ui/calendar';
import { FormComponent } from '@fitmonitor/shared/ui/form';
import { ScheduleService } from '@fitmonitor/schedule/data-access';
import { ScheduleComponent } from '@fitmonitor/schedule/client-schedule/features/ui/schedule';
import { AuthService } from '@fitmonitor/data-access';

import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

@Component({
  selector: 'fitmonitor-home',
  standalone: true,
  imports: [
    NzLayoutModule,
    NzTabsModule,
    NzEmptyModule,
    FormComponent,
    MetricComponent,
    CalendarComponent,
    ScheduleComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly authService = inject(AuthService);
  private readonly metricsService = inject(MetricsService);
  private readonly scheduleService = inject(ScheduleService);
  private readonly calendarsService = inject(CalendarService);

  readonly usersData = toSignal(
    toObservable(this.authService.user).pipe(
      filter(Boolean),
      switchMap(() =>
        forkJoin([
          this.metricsService.getAllMetrics(),
          this.calendarsService.getAllCalendars(),
          this.scheduleService.getAllSchedules(),
        ]).pipe(
          map(([metrics, calendars, schedules]) => ({
            metrics,
            calendars,
            schedules,
          })),
        ),
      ),
    ),
  );
}
