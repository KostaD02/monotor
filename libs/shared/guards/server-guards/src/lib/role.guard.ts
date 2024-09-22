import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import {
  UserPayload,
  ExceptionStatusKeys,
  AuthExpectionKeys,
} from '@fitmonitor/interfaces';
import { ExceptionService } from '@fitmonitor/server-services';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private jwtService: JwtService,
    private exceptionService: ExceptionService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    const accessTokenCookie = request.cookies.access_token;

    let accessToken = '';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      accessToken = authHeader.substring(7);
    } else if (accessTokenCookie) {
      accessToken = accessTokenCookie;
    }

    const user = this.jwtService.decode(accessToken) as UserPayload;

    const isAllowed = roles.some((role) => role === user.role);

    if (!isAllowed) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.Conflict,
        "Current user role doesn't have enough permission to use this endpoint",
        AuthExpectionKeys.UserPermissionNotGranted
      );
    }

    return true;
  }
}
