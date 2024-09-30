import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MetricsGeneralFormComponent } from '@fitmonitor/metrics/client-metrics/ui/metrics-general-form';

@Component({
  selector: 'fitmonitor-client-metrics',
  standalone: true,
  imports: [MetricsGeneralFormComponent],
  templateUrl: './client-metrics.component.html',
  styleUrl: './client-metrics.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientMetricsComponent {}
