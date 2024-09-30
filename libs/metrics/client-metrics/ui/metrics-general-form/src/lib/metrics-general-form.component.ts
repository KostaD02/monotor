import { ChangeDetectionStrategy, Component } from '@angular/core';

import { METRICS_FORM_DATA } from '@fitmonitor/consts';
import { FormComponent } from '@fitmonitor/shared/ui/form';

@Component({
  selector: 'fitmonitor-metrics-general-form',
  standalone: true,
  imports: [FormComponent],
  templateUrl: './metrics-general-form.component.html',
  styleUrl: './metrics-general-form.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricsGeneralFormComponent {
  readonly formItems = METRICS_FORM_DATA;

  onFormSubmit(data: unknown) {
    console.log(data);
  }
}
