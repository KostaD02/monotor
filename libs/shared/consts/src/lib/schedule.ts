import { FormItem } from '@fitmonitor/interfaces';
import { API_CONFIG } from './api';

export const SCHEDULE_FORM_INPUT: FormItem[] = [
  {
    name: 'name',
    type: 'text',
    icon: 'table',
    label: 'Enter schedule name',
    invalid: `Please enter valid schedule name (min ${API_CONFIG.MIN_SCHEDULE_NAME_LENGTH}, max ${API_CONFIG.MAX_SCHEDULE_NAME_LENGTH} characters)`,
    placeholder: 'For example workout',
    validators: {
      required: true,
      minLength: API_CONFIG.MIN_SCHEDULE_NAME_LENGTH,
      maxLength: API_CONFIG.MAX_SCHEDULE_NAME_LENGTH,
    },
  },
];

export const CREATE_SCHEDULE_DATA_FORM_INPUT: FormItem[] = [
  {
    name: 'time',
    type: 'time',
    icon: 'clock-circle',
    label: 'Choose time',
    invalid: 'Please choose valid time',
    placeholder: 'For example 10:00',
    validators: {
      required: true,
    },
  },
  {
    name: 'value',
    type: 'text',
    icon: 'file',
    label: 'Enter value for schedule',
    invalid: `Please enter valid value (min ${API_CONFIG.MIN_SCHEDULE_VALUE_LENGTH}, max ${API_CONFIG.MAX_SCHEDULE_VALUE_LENGTH} characters)`,
    placeholder: 'For exmaple workout',
    validators: {
      required: true,
      minLength: API_CONFIG.MIN_SCHEDULE_VALUE_LENGTH,
      maxLength: API_CONFIG.MAX_SCHEDULE_VALUE_LENGTH,
    },
  },
];

export const EDIT_SCHEDULE_DAWTA_FORM_INPUT: FormItem[] = [
  {
    name: 'week',
    type: 'text',
    icon: 'borderless-table',
    label: 'Choose week day (mon | tue | wed | thu | fri | sat | sun)',
    invalid:
      'Please choose valid week day (mon | tue | wed | thu | fri | sat | sun)',
    placeholder: 'For example mon',
    validators: {
      required: true,
      minLength: 3,
      maxLength: 3,
    },
  },
  ...CREATE_SCHEDULE_DATA_FORM_INPUT,
];
