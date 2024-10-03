import { Time } from '@fitmonitor/interfaces';
import { TIME_REGEX } from '@fitmonitor/consts';

export function isValidTime(time: string) {
  // ? Format should be HH:MM
  return TIME_REGEX.test(time);
}

export function convertToTime(time: string): Time {
  if (isValidTime(time)) {
    return time as Time;
  }

  const date = new Date(time);

  if (date.toString() === 'Invalid Date') {
    throw new Error(
      `Invalid time, provided time should be in HH:MM format (${TIME_REGEX})`,
    );
  }

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}`;
}

export function concatDateAndTime(date: string, time: string) {
  let concatedDate = new Date().toISOString();

  if (date && time) {
    concatedDate = new Date(`${date} ${time}`).toISOString();
  } else if (date) {
    concatedDate = new Date(date).toISOString();
  } else if (time) {
    concatedDate = new Date(
      `${new Date().toLocaleDateString()} ${time}`,
    ).toISOString();
  }

  return concatedDate;
}
