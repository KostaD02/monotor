import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Metrics } from '@fitmonitor/interfaces';

@Component({
  selector: 'fitmonitor-metric',
  standalone: true,
  imports: [],
  templateUrl: './metric.component.html',
  styleUrl: './metric.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricComponent {
  @Input({ required: true }) data: Metrics | null = null;
}
