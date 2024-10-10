import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ExceptionService, EncryptionService } from '@monotor/server-services';
import { UserModule } from '@monotor/server-auth';

import { AppController } from './app.controller';
import { MetricsModule } from '@monotor/server-metrics';
import { CalendarModule } from '@monotor/server-calendar';
import { ScheduleModule } from '@monotor/server-schedule';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    UserModule,
    MetricsModule,
    CalendarModule,
    ScheduleModule,
  ],
  controllers: [AppController],
  providers: [ExceptionService, EncryptionService],
})
export class AppModule {}
