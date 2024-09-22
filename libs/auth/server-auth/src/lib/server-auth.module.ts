import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import {
  EncryptionService,
  ExceptionService,
  MongooseValidatorService,
} from '@fitmonitor/server-services';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@fitmonitor/schemas';

import { JwtStrategy, LocalStrategy, RefreshJwtStrategy } from './strategies';
import { AuthController } from './server-auth.controller';
import { AuthService } from './server-auth.service';
import { RefreshJwtGuard } from './guards';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: `${process.env['JWT_SECRET']}`,
      signOptions: { expiresIn: `${process.env['JWT_EXPIRES_IN'] || '1'}h` },
    }),
  ],
  providers: [
    RefreshJwtGuard,
    ExceptionService,
    EncryptionService,
    MongooseValidatorService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshJwtStrategy,
  ],
  controllers: [AuthController],
})
export class UserModule {}
