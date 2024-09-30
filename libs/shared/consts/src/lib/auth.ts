// TODO: Adjust to FormItem

export const LOGIN_FORM_DATA = [
  {
    name: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    invalid: 'Please enter valid email',
    type: 'email',
    icon: 'user',
  },
  {
    name: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    invalid: 'Please enter valid password (min 8, max 30 characters)',
    type: 'password',
    icon: 'lock',
  },
];

export const REGISTER_FORM_DATA = [
  {
    name: 'firstName',
    label: 'First Name',
    placeholder: 'Enter your first name',
    invalid: 'Please enter valid first name (min 2, max 20 characters)',
    type: 'text',
  },
  {
    name: 'lastName',
    label: 'Last Name',
    placeholder: 'Enter your last name',
    invalid: 'Please enter valid last name (min 2, max 20 characters)',
    type: 'text',
  },
  ...LOGIN_FORM_DATA,
];
