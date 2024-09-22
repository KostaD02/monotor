import {
  Catch,
  HttpException,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse() as {
      message: string | string[];
      error: string;
      statusCode: number;
    };

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
