import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { MetricsService } from '@fitmonitor/client-metrics/data-access';
import { MetricComponent } from '@fitmonitor/metrics/client-metrics/features/ui/metric';
import { CalendarService } from '@fitmonitor/client-calendar/data-access';
import { CalendarComponent } from '@fitmonitor/calendar/client-calendar/features/ui/calendar';
import { FormComponent } from '@fitmonitor/shared/ui/form';

import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'fitmonitor-home',
  standalone: true,
  imports: [
    NzLayoutModule,
    NzTabsModule,
    FormComponent,
    MetricComponent,
    CalendarComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly metricsService = inject(MetricsService);
  private readonly calendarsService = inject(CalendarService);

  readonly metrics = toSignal(this.metricsService.getAllMetrics());
  readonly calendars = toSignal(this.calendarsService.getAllCalendars());
}
