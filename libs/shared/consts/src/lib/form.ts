import { FormItem } from '@fitmonitor/interfaces';

export const DATE_FORM_INPUT: FormItem = {
  name: 'date',
  type: 'date',
  icon: 'calendar',
  label: 'Enter date (default is current date)',
  invalid: 'Please enter valid date',
  placeholder: 'For example current date',
  validators: {},
};

export const TIME_FORM_INPUT: FormItem = {
  name: 'time',
  type: 'time',
  icon: 'field-time',
  label: 'Enter time (default is current time)',
  invalid: 'Please enter valid time',
  placeholder: 'For example current time',
  validators: {},
};
