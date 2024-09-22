import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRole } from '@fitmonitor/interfaces';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop() firstName!: string;
  @Prop() lastName!: string;
  @Prop() email!: string;
  @Prop() password!: string;
  @Prop({
    default: UserRole.Default,
    type: String,
  })
  role!: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
