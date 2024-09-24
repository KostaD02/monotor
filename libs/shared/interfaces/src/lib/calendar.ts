export interface Calendar {
  _id: string;
  name: string;
  ownerID: string;
  data: CalendarData;
}

export interface CalendarData {
  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
  sat: string;
  sun: string;
}
