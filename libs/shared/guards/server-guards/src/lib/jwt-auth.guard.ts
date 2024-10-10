import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import {
  UserPayload,
  AuthExpectionKeys,
  ExceptionStatusKeys,
} from '@monotor/interfaces';
import { User, UserDocument } from '@monotor/schemas';
import { ExceptionService } from '@monotor/server-services';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private exceptionService: ExceptionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.Unauthorized,
        'Token not found',
        AuthExpectionKeys.TokenNotFound,
      );
    }
    let decoded: UserPayload | null = null;
    try {
      decoded = (await this.jwtService.verifyAsync(token || '', {
        secret: `${process.env['JWT_SECRET']}`,
      })) as UserPayload;
    } catch (err) {
      const error = err as { name: string; expiredAt: string };
      const errorName = error.name || '';
      if (errorName === 'TokenExpiredError') {
        this.exceptionService.throwError(
          ExceptionStatusKeys.BadRequest,
          `Token expired, expired at: ${error.expiredAt}`,
          AuthExpectionKeys.TokenExpired,
        );
      } else {
        this.exceptionService.throwError(
          ExceptionStatusKeys.BadRequest,
          'Invalid token',
          AuthExpectionKeys.TokenInvalid,
        );
      }
    }
    const user = await this.userModel.findOne({ email: decoded?.email });
    if (!user) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.NotFound,
        `Token contains incorrect user`,
        AuthExpectionKeys.TokenContainsIncorrectUser,
      );
      return false;
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string {
    const authHeader = request.headers?.authorization || '';
    const accessTokenCookie = request?.cookies?.access_token || '';
    let accessToken = '';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      accessToken = authHeader.substring(7);
    } else if (accessTokenCookie) {
      accessToken = accessTokenCookie;
    }
    return accessToken;
  }
}
