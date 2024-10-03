import { FormItem } from '@fitmonitor/interfaces';

import { API_CONFIG } from './api';
import { DATE_FORM_INPUT, TIME_FORM_INPUT } from './form';

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

export const METRICS_ITEM_FORM_DATA: FormItem[] = [
  {
    name: 'value',
    type: 'number',
    icon: 'field-number',
    label: 'Enter metric value',
    invalid: 'Please enter valid metric value (min 1)',
    placeholder: 'For example 22"',
    validators: {
      required: true,
      minLength: 1,
    },
  },
  DATE_FORM_INPUT,
  TIME_FORM_INPUT,
];

export const METRIC_ITEM_UPDATE_FORM_DATA: FormItem[] = [
  {
    name: 'value',
    type: 'number',
    icon: 'field-number',
    label: 'Enter metric value',
    invalid: 'Please enter valid metric value (min 1)',
    placeholder: 'For example 22"',
    validators: {
      minLength: 1,
    },
  },
  DATE_FORM_INPUT,
  TIME_FORM_INPUT,
];

export const METRIC_EDIT_FORM_DATA: FormItem[] = [
  {
    name: 'name',
    type: 'text',
    icon: 'file-text',
    label: 'Enter metric name',
    invalid: `Please enter valid metric name (min ${API_CONFIG.MIN_METRICS_NAME_LENGTH}, max ${API_CONFIG.MAX_METRICS_NAME_LENGTH} characters)`,
    placeholder: 'For example "Weight"',
    validators: {
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
    validators: { min: API_CONFIG.MIN_DESIRED_METRICS_VALUE },
  },
];
