import { FormItem } from '@fitmonitor/interfaces';
import { API_CONFIG } from './api';

export const CALENDAR_FORM_INPUT: FormItem[] = [
  {
    name: 'name',
    type: 'text',
    icon: 'calendar',
    label: 'Enter calendar name',
    invalid: `Please enter valid calendar name (min ${API_CONFIG.MIN_CALENDAR_NAME_LENGTH}, max ${API_CONFIG.MAX_CALENDAR_NAME_LENGTH} characters)`,
    placeholder: 'For example workout',
    validators: {
      required: true,
      minLength: API_CONFIG.MIN_CALENDAR_NAME_LENGTH,
      maxLength: API_CONFIG.MAX_CALENDAR_NAME_LENGTH,
    },
  },
];

export const CALENDAR_DATA_FORM_INPUT: FormItem[] = [
  {
    name: 'value',
    type: 'text',
    icon: 'file',
    label: 'Enter week value (empty = nothing)',
    invalid: `Please enter valid week value (min ${API_CONFIG.MIN_CALENDAR_NAME_LENGTH}, max ${API_CONFIG.MAX_CALENDAR_NAME_LENGTH} characters)`,
    placeholder: 'For example workout',
    validators: {
      minLength: API_CONFIG.MIN_CALENDAR_NAME_LENGTH,
      maxLength: API_CONFIG.MAX_CALENDAR_NAME_LENGTH,
    },
  },
];
