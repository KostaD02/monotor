import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRole } from '@fitmonitor/interfaces';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({ required: true, type: String }) firstName!: string;
  @Prop({ required: true, type: String }) lastName!: string;
  @Prop({ required: true, type: String }) email!: string;
  @Prop({ required: true, type: String }) password!: string;
  @Prop({
    default: UserRole.Default,
    required: true,
    type: String,
  })
  role!: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
