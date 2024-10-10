import { Controller, Get } from '@nestjs/common';

import {
  AuthExpectionKeys,
  CalendarExceptionKeys,
  ExceptionStatusKeys,
  GlobalExceptionKeys,
  MetricsExceptionKeys,
  ScheduleExpceptionKeys,
} from '@monotor/interfaces';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Base')
@Controller()
export class AppController {
  @Get()
  base() {
    return {
      message: 'Welcome to MonoTor API',
      github: 'https://github.com/KostaD02/monotor',
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
