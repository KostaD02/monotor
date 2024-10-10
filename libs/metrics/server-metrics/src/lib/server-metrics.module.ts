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
  Metrics,
  MetricsData,
  MetricsDataSchema,
  MetricsSchema,
  User,
  UserSchema,
} from '@monotor/schemas';
import { MetricsController } from './server-metrics.controller';
import { MetricsService } from './server-metrics.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Metrics.name, schema: MetricsSchema },
      { name: MetricsData.name, schema: MetricsDataSchema },
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
    MetricsService,
  ],
  controllers: [MetricsController],
})
export class MetricsModule {}
