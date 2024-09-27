import {
  User,
  UserSchema,
  Schedule,
  ScheduleSchema,
  ScheduleData,
  ScheduleDataSchema,
} from '@fitmonitor/schemas';
import {
  ExceptionService,
  EncryptionService,
  MongooseValidatorService,
} from '@fitmonitor/server-services';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleService } from './server-schedule.service';
import { ScheduleController } from './server-schedule.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Schedule.name, schema: ScheduleSchema },
      { name: ScheduleData.name, schema: ScheduleDataSchema },
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
    ScheduleService,
  ],
  controllers: [ScheduleController],
})
export class ScheduleModule {}
