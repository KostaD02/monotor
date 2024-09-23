import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ versionKey: false, timestamps: false })
export class MetricsData {
  @Prop({ required: true, type: Number }) value!: number;
  @Prop({ required: true, type: String }) date!: string;
  @Prop({ required: true, type: Boolean }) desiredValueReached!: boolean;
}

@Schema({ versionKey: false, timestamps: true })
export class Metrics {
  @Prop({ required: true, type: String }) name!: string;
  @Prop({ required: true, type: String }) ownerID!: string;
  @Prop({ required: true, type: Number }) desiredValue!: number;
  @Prop([{ required: true, type: MetricsData, default: [] }])
  data!: MetricsData[];
}

export type MetricsDocument = HydratedDocument<Metrics>;
export const MetricsSchema = SchemaFactory.createForClass(Metrics);

export type MetricsDataDocument = HydratedDocument<MetricsData>;
export const MetricsDataSchema = SchemaFactory.createForClass(MetricsData);
