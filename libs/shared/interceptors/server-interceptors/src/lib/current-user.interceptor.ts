import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private jwtService: JwtService) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];
    const accessTokenCookie = request.cookies.access_token;

    let accessToken = '';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      accessToken = authHeader.substring(7);
    } else if (accessTokenCookie) {
      accessToken = accessTokenCookie;
    }

    const user = this.jwtService.decode(accessToken);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    request.user = user;

    return handler.handle();
  }
}
