import { Controller, Get } from '@nestjs/common';

import {
  AuthExpectionKeys,
  CalendarExceptionKeys,
  ExceptionStatusKeys,
  GlobalExceptionKeys,
  MetricsExceptionKeys,
  ScheduleExpceptionKeys,
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
      swagger: `http://localhost:2222/api/swagger`,
    };
  }

  @Get('lang/errors')
  getErrors() {
    return Object.values({
      ...ExceptionStatusKeys,
      ...GlobalExceptionKeys,
      ...AuthExpectionKeys,
      ...MetricsExceptionKeys,
      ...CalendarExceptionKeys,
      ...ScheduleExpceptionKeys,
    });
  }
}
