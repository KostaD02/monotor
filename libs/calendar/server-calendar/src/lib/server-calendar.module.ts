import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import {
  EncryptionService,
  ExceptionService,
  MongooseValidatorService,
} from '@monotor/server-services';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Calendar,
  CalendarData,
  CalendarDataSchema,
  CalendarSchema,
  User,
  UserSchema,
} from '@monotor/schemas';
import { CalendarService } from './server-calendar.service';
import { CalendarController } from './server-calendar.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Calendar.name, schema: CalendarSchema },
      { name: CalendarData.name, schema: CalendarDataSchema },
    ]),
    JwtModule.register({
      secret: `${process.env['JWT_SECRET']}`,
      signOptions: { expiresIn: `${process.env['JWT_EXPIRES_IN'] || '1'}h` },
    }),
  ],
  providers: [
    ExceptionService,
    EncryptionService,
    MongooseValidatorService,
    CalendarService,
  ],
  controllers: [CalendarController],
})
export class CalendarModule {}
