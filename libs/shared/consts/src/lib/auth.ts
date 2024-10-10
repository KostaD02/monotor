import { FormItem } from '@monotor/interfaces';

import { API_CONFIG } from './api';

export const PASSWORD_FORM_ITEM: FormItem = {
  name: 'password',
  label: 'Password',
  placeholder: 'Enter your password',
  invalid: `Please enter valid password (min ${API_CONFIG.MIN_PASSWORD_LENGTH}, max ${API_CONFIG.MAX_PASSWORD_LENGTH} characters)`,
  type: 'password',
  icon: 'lock',
  validators: {
    required: true,
    minLength: API_CONFIG.MIN_PASSWORD_LENGTH,
    maxLength: API_CONFIG.MAX_PASSWORD_LENGTH,
  },
};

export const LOGIN_FORM_DATA: FormItem[] = [
  {
    name: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    invalid: 'Please enter valid email',
    type: 'email',
    icon: 'user',
    validators: {
      email: true,
      required: true,
    },
  },
  PASSWORD_FORM_ITEM,
];

export const NAMES_FORM_DATA: FormItem[] = [
  {
    name: 'firstName',
    label: 'First Name',
    placeholder: 'Enter your first name',
    invalid: `Please enter valid first name (min ${API_CONFIG.MIN_FIRSTNAME_LENGTH}, max ${API_CONFIG.MAX_FIRSTNAME_LENGTH} characters)`,
    type: 'text',
    icon: 'info',
    validators: {
      required: true,
      minLength: API_CONFIG.MIN_FIRSTNAME_LENGTH,
      maxLength: API_CONFIG.MAX_FIRSTNAME_LENGTH,
    },
  },
  {
    name: 'lastName',
    label: 'Last Name',
    placeholder: 'Enter your last name',
    invalid: `Please enter valid last name (min ${API_CONFIG.MIN_LASTNAME_LENGTH}, max ${API_CONFIG.MAX_LASTNAME_LENGTH} characters)`,
    type: 'text',
    icon: 'team',
    validators: {
      required: true,
      minLength: API_CONFIG.MIN_LASTNAME_LENGTH,
      maxLength: API_CONFIG.MAX_LASTNAME_LENGTH,
    },
  },
];

export const UPDATE_PASSWORD_FORM_DATA: FormItem[] = [
  PASSWORD_FORM_ITEM,
  {
    name: 'newPassword',
    label: 'New password',
    placeholder: 'Enter your new password',
    invalid: `Please enter valid password (min ${API_CONFIG.MIN_PASSWORD_LENGTH}, max ${API_CONFIG.MAX_PASSWORD_LENGTH} characters)`,
    type: 'password',
    icon: 'block',
    validators: {
      required: true,
      minLength: API_CONFIG.MIN_PASSWORD_LENGTH,
      maxLength: API_CONFIG.MAX_PASSWORD_LENGTH,
    },
  },
];

export const REGISTER_FORM_DATA: FormItem[] = [
  ...NAMES_FORM_DATA,
  ...LOGIN_FORM_DATA,
];

export const EDIT_USER_FORM_DATA: FormItem[] = [
  {
    name: 'firstName',
    label: 'First Name',
    placeholder: 'Enter your first name',
    invalid: `Please enter valid first name (min ${API_CONFIG.MIN_FIRSTNAME_LENGTH}, max ${API_CONFIG.MAX_FIRSTNAME_LENGTH} characters)`,
    type: 'text',
    icon: 'info',
    validators: {
      minLength: API_CONFIG.MIN_FIRSTNAME_LENGTH,
      maxLength: API_CONFIG.MAX_FIRSTNAME_LENGTH,
    },
  },
  {
    name: 'lastName',
    label: 'Last Name',
    placeholder: 'Enter your last name',
    invalid: `Please enter valid last name (min ${API_CONFIG.MIN_LASTNAME_LENGTH}, max ${API_CONFIG.MAX_LASTNAME_LENGTH} characters)`,
    type: 'text',
    icon: 'team',
    validators: {
      minLength: API_CONFIG.MIN_LASTNAME_LENGTH,
      maxLength: API_CONFIG.MAX_LASTNAME_LENGTH,
    },
  },
  {
    name: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    invalid: 'Please enter valid email',
    type: 'email',
    icon: 'user',
    validators: {
      email: false,
    },
  },
  {
    name: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    invalid: `Please enter valid password (min ${API_CONFIG.MIN_PASSWORD_LENGTH}, max ${API_CONFIG.MAX_PASSWORD_LENGTH} characters)`,
    type: 'password',
    icon: 'lock',
    validators: {
      minLength: API_CONFIG.MIN_PASSWORD_LENGTH,
      maxLength: API_CONFIG.MAX_PASSWORD_LENGTH,
    },
  },
  {
    name: 'role',
    label: 'Role',
    placeholder: 'Write role, e.g. admin | empty = default',
    type: 'text',
    icon: 'crown',
    invalid: `Please enter valid value`,
    validators: {},
  },
];
