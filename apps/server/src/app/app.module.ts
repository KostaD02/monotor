import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ExceptionService,
  EncryptionService,
} from '@fitmonitor/server-services';
import { UserModule } from '@fitmonitor/server-auth';

import { AppController } from './app.controller';
import { MetricsModule } from '@fitmonitor/server-metrics';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    UserModule,
    MetricsModule,
  ],
  controllers: [AppController],
  providers: [ExceptionService, EncryptionService],
})
export class AppModule {}
