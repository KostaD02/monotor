import { FormItem } from '@fitmonitor/interfaces';

import { API_CONFIG } from './api';

export const METRICS_FORM_DATA: FormItem[] = [
  {
    name: 'name',
    type: 'text',
    icon: 'file-text',
    label: 'Enter metric name',
    invalid: `Please enter valid metric name (min ${API_CONFIG.MIN_METRICS_NAME_LENGTH}, max ${API_CONFIG.MAX_METRICS_NAME_LENGTH} characters)`,
    placeholder: 'For example "Weight"',
    validators: {
      required: true,
      minLength: API_CONFIG.MIN_METRICS_NAME_LENGTH,
      maxLength: API_CONFIG.MAX_METRICS_NAME_LENGTH,
    },
  },
  {
    name: 'desiredValue',
    type: 'number',
    icon: 'field-number',
    label: 'Enter desired value',
    invalid: `Please enter valid desired value (min ${API_CONFIG.MIN_DESIRED_METRICS_VALUE})`,
    placeholder: 'For example "70"',
    validators: { required: true, min: API_CONFIG.MIN_DESIRED_METRICS_VALUE },
  },
];
