import { Timestamps } from './timestamps';
import { Week } from './week';

export interface Schedule extends Timestamps {
  _id: string;
  name: string;
  ownerID: string;
  data: Record<Week, Record<string, string>>;
}
