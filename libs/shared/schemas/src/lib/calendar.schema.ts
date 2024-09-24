import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ versionKey: false, timestamps: false, _id: false })
export class CalendarData {
  @Prop({ required: false, type: String, default: '' }) mon!: string;
  @Prop({ required: false, type: String, default: '' }) tue!: string;
  @Prop({ required: false, type: String, default: '' }) wed!: string;
  @Prop({ required: false, type: String, default: '' }) thu!: string;
  @Prop({ required: false, type: String, default: '' }) fri!: string;
  @Prop({ required: false, type: String, default: '' }) sat!: string;
  @Prop({ required: false, type: String, default: '' }) sun!: string;
}

@Schema({ versionKey: false, timestamps: true })
export class Calendar {
  @Prop({ required: true, type: String }) name!: string;
  @Prop({ required: true, type: String }) ownerID!: string;
  @Prop({
    required: true,
    type: CalendarData,
    _id: false,
    default: {
      mon: '',
      tue: '',
      wed: '',
      thu: '',
      fri: '',
      sat: '',
      sun: '',
    },
  })
  data!: Record<string, string>;
}

export type CalendarDocument = HydratedDocument<Calendar>;
export const CalendarSchema = SchemaFactory.createForClass(Calendar);

export type CalendarDataDocument = HydratedDocument<CalendarData>;
export const CalendarDataSchema = SchemaFactory.createForClass(CalendarData);
