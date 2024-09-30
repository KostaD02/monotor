import { Validators } from '@angular/forms';
import { FormItem } from '@fitmonitor/interfaces';

export const METRICS_FORM_DATA: FormItem[] = [
  {
    name: 'name',
    type: 'text',
    icon: 'file-text',
    label: 'Enter metric name',
    invalid: 'Please enter valid metric name (min 2, max 20 characters)',
    placeholder: 'For example "Weight"',
    validators: [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20),
    ],
  },
  {
    name: 'desiredValue',
    type: 'number',
    icon: 'field-number',
    label: 'Enter desired value',
    invalid: 'Please enter valid desired value (min 1)',
    placeholder: 'For example "70"',
    validators: [Validators.required, Validators.min(1)],
  },
];
