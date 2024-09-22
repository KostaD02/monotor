import { ExceptionStatusKeys } from '@fitmonitor/interfaces';
import { Logger, LoggerSide } from '@fitmonitor/util';
import {
  Catch,
  HttpException,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionsFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const isHttpException =
      exception.name === 'HttpException' ||
      exception.name === 'NotFoundException:';
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = isHttpException
      ? (exception as HttpException)?.getStatus()
      : 500;

    const exceptionResponse: {
      message: string | string[];
      error: string;
    } = {
      error: exception.message,
      message: ExceptionStatusKeys.InternalServerError,
    };

    if (isHttpException) {
      const data = (exception as HttpException).getResponse() as {
        message: string | string[];
        error: string;
        statusCode: number;
      };
      exceptionResponse.error = data.error;
      exceptionResponse.message = data.message;
    } else {
      Logger.error(
        `At endpoint: ${request.url}\n${exception.stack}`,
        LoggerSide.Server
      );
    }

    response.status(status).json({
      error: exceptionResponse.error,
      errorKeys: exceptionResponse.message,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      help: 'if you think this error should not happen, please create new issue at: https://github.com/KostaD02/fitmonitor/issues',
    });
  }
}
