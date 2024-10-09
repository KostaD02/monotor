import { Time, Timestamps } from './timestamps';
import { Week } from './week';

export interface Schedule extends Timestamps {
  _id: string;
  name: string;
  ownerID: string;
  data: Record<Week, Record<string, string>>;
}

export type SchedulePayload = {
  [key in Week]?: Record<Time, string>;
};

export interface ScheduleDuplicatePayload extends SchedulePayload {
  duplicate: boolean;
}

export interface ScheduleCreatePayload {
  time: Time;
  value: string;
}

export interface ScheduleUpdatePayload extends ScheduleCreatePayload {
  week: string;
}
