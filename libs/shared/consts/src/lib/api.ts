export const API_CONFIG = {
  MAX_FIRSTNAME_LENGTH: 20,
  MIN_FIRSTNAME_LENGTH: 2,
  MAX_LASTNAME_LENGTH: 20,
  MIN_LASTNAME_LENGTH: 2,
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 30,
  MIN_METRICS_NAME_LENGTH: 2,
  MAX_METRICS_NAME_LENGTH: 20,
  MIN_DESIRED_METRICS_VALUE: 1,
  MIN_CALENDAR_NAME_LENGTH: 2,
  MAX_CALENDAR_NAME_LENGTH: 20,
  MIN_SCHEDULE_NAME_LENGTH: 2,
  MAX_SCHEDULE_NAME_LENGTH: 20,
  MIN_SCHEDULE_VALUE_LENGTH: 2,
  MAX_SCHEDULE_VALUE_LENGTH: 50,
};

export const API_PROTOCOL = 'http';
export const API_DOMAIN = 'localhost:2201';
/*
  TODO: remove API_URL safely or replace with environment variable somehow
  Since project has global interceptor url will be swapped based on user prompt
*/
export const API_URL = `${API_PROTOCOL}://${API_DOMAIN}/api`;
export const RETRY_AUTH_CHECK = 300000;
