import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MetricsService } from '@fitmonitor/client-metrics/data-access';
import { MetricComponent } from '@fitmonitor/metrics/client-metrics/features/ui/metric';
import { FormComponent } from '@fitmonitor/shared/ui/form';

import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { JsonPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'fitmonitor-home',
  standalone: true,
  imports: [
    NzLayoutModule,
    NzTabsModule,
    FormComponent,
    MetricComponent,
    JsonPipe,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly metricsService = inject(MetricsService);

  readonly metrics = toSignal(this.metricsService.getAllMetrics());
}
