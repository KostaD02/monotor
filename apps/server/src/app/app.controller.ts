import { Controller, Get } from '@nestjs/common';

import {
  AuthExpectionKeys,
  ExceptionStatusKeys,
  GlobalExceptionKeys,
} from '@fitmonitor/interfaces';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Base')
@Controller()
export class AppController {
  @Get()
  base() {
    return {
      message: 'Welcome to FitMonitor API',
      github: 'https://github.com/KostaD02/fitmonitor',
    };
  }

  @Get('lang/errors')
  getErrors() {
    return Object.values({
      ...ExceptionStatusKeys,
      ...GlobalExceptionKeys,
      ...AuthExpectionKeys,
    });
  }
}
