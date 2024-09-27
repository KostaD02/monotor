import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ versionKey: false, timestamps: false, _id: false, minimize: false })
export class ScheduleData {
  @Prop({ required: true, type: Object, default: {} }) mon!: object;
  @Prop({ required: true, type: Object, default: {} }) tue!: object;
  @Prop({ required: true, type: Object, default: {} }) wed!: object;
  @Prop({ required: true, type: Object, default: {} }) thu!: object;
  @Prop({ required: true, type: Object, default: {} }) fri!: object;
  @Prop({ required: true, type: Object, default: {} }) sat!: object;
  @Prop({ required: true, type: Object, default: {} }) sun!: object;
}

@Schema({ versionKey: false, timestamps: true, minimize: false })
export class Schedule {
  @Prop({ required: true, type: String }) name!: string;
  @Prop({ required: true, type: String }) ownerID!: string;
  @Prop({
    required: true,
    type: ScheduleData,
    _id: false,
    default: {
      mon: {},
      tue: {},
      wed: {},
      thu: {},
      fri: {},
      sat: {},
      sun: {},
    },
  })
  data!: ScheduleData;
}

export type ScheduleDocument = HydratedDocument<Schedule>;
export const ScheduleSchema = SchemaFactory.createForClass(Schedule);

export type ScheduleDataDocument = HydratedDocument<ScheduleData>;
export const ScheduleDataSchema = SchemaFactory.createForClass(ScheduleData);
