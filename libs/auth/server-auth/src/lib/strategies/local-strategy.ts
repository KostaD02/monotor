import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExceptionService } from '@fitmonitor/server-services';
import { AuthExpectionKeys, ExceptionStatusKeys } from '@fitmonitor/interfaces';

import { Strategy } from 'passport-local';

import { AuthService } from '../server-auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private exceptionService: ExceptionService
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string) {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.BadRequest,
        'Invalid credentials',
        AuthExpectionKeys.IncorrectEmailOrPassword
      );
    }
    return user;
  }
}
