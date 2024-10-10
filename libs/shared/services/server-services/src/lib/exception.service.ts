import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ExceptionStatusKeys } from '@monotor/interfaces';

@Injectable()
export class ExceptionService {
  public throwError(
    exception: ExceptionStatusKeys,
    message: string,
    errorKey?: string | string[],
  ) {
    const status = this.getStatusCode(exception);
    const httpExceptionObject: {
      status: number;
      error: string;
      message: string[];
    } = {
      status,
      error: message,
      message: [],
    };
    if (message && errorKey) {
      if (typeof errorKey === 'object') {
        httpExceptionObject.message.push(...errorKey);
      } else {
        httpExceptionObject.message.push(errorKey);
      }
    }
    throw new HttpException(httpExceptionObject, status);
  }

  get statusKeys() {
    return [
      {
        status: 400,
        key: ExceptionStatusKeys.BadRequest,
      },
      {
        status: 401,
        key: ExceptionStatusKeys.Unauthorized,
      },
      {
        status: 402,
        key: ExceptionStatusKeys.PaymentRequired,
      },
      {
        status: 403,
        key: ExceptionStatusKeys.Forbidden,
      },
      {
        status: 404,
        key: ExceptionStatusKeys.NotFound,
      },
      {
        status: 409,
        key: ExceptionStatusKeys.Conflict,
      },
      {
        status: 413,
        key: ExceptionStatusKeys.ContentTooLarge,
      },
      {
        status: 415,
        key: ExceptionStatusKeys.UnsupportedMediaType,
      },
      {
        status: 418,
        key: ExceptionStatusKeys.Teapot,
      },
      {
        status: 420,
        key: ExceptionStatusKeys.EnhanceYourCalm,
      },
      {
        status: 500,
        key: ExceptionStatusKeys.InternalServerError,
      },
    ];
  }

  getStatusCode(key: ExceptionStatusKeys) {
    switch (key) {
      case ExceptionStatusKeys.BadRequest:
        return HttpStatus.BAD_REQUEST;
      case ExceptionStatusKeys.Unauthorized:
        return HttpStatus.UNAUTHORIZED;
      case ExceptionStatusKeys.PaymentRequired:
        return HttpStatus.PAYMENT_REQUIRED;
      case ExceptionStatusKeys.Forbidden:
        return HttpStatus.FORBIDDEN;
      case ExceptionStatusKeys.NotFound:
        return HttpStatus.NOT_FOUND;
      case ExceptionStatusKeys.Conflict:
        return HttpStatus.CONFLICT;
      case ExceptionStatusKeys.ContentTooLarge:
        return HttpStatus.PAYLOAD_TOO_LARGE;
      case ExceptionStatusKeys.UnsupportedMediaType:
        return HttpStatus.UNSUPPORTED_MEDIA_TYPE;
      case ExceptionStatusKeys.Teapot:
        return HttpStatus.I_AM_A_TEAPOT;
      case ExceptionStatusKeys.InternalServerError:
        return HttpStatus.INTERNAL_SERVER_ERROR;
      default:
        return 420;
    }
  }
}
