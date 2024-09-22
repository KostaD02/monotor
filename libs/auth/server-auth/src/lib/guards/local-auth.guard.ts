import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthExpectionKeys, ExceptionStatusKeys } from '@fitmonitor/interfaces';
import { ExceptionService } from '@fitmonitor/server-services';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(private exceptionService: ExceptionService) {
    super();
  }

  // TODO: create type
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  override handleRequest(err, user, info, context) {
    const request = context.switchToHttp().getRequest();
    const { email, password } = request.body;
    if (err || !user) {
      if (!email && !password) {
        this.exceptionService.throwError(
          ExceptionStatusKeys.BadRequest,
          'Should be provide: Email and Password',
          [
            AuthExpectionKeys.ShouldProvideEmail,
            AuthExpectionKeys.ShouldProvidePassword,
          ]
        );
      } else if (!email) {
        this.exceptionService.throwError(
          ExceptionStatusKeys.BadRequest,
          'Email should be provided',
          AuthExpectionKeys.ShouldProvideEmail
        );
      } else if (!password) {
        this.exceptionService.throwError(
          ExceptionStatusKeys.BadRequest,
          'Password should be provided',
          AuthExpectionKeys.ShouldProvidePassword
        );
      } else {
        this.exceptionService.throwError(
          ExceptionStatusKeys.BadRequest,
          err.response.error,
          err.response.message
        );
      }
    }
    return user;
  }
}
