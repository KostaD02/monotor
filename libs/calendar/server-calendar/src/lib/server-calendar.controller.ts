import { ApiTags } from '@nestjs/swagger';
import { CalendarService } from './server-calendar.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserPayload } from '@fitmonitor/interfaces';
import { CurrentUser } from '@fitmonitor/server-decorators';
import { JwtGuard } from '@fitmonitor/server-guards';
import { CurrentUserInterceptor } from '@fitmonitor/server-interceptors';
import { CalendarDataDto, CalendarDto } from './dtos';

@ApiTags('Calendar')
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('all')
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  getCurrentUser(@CurrentUser() user: UserPayload) {
    return this.calendarService.getCalendars(user);
  }

  @Get('name/:name')
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  getCalendarByName(
    @CurrentUser() user: UserPayload,
    @Param('name') name: string,
  ) {
    return this.calendarService.getCalendarByName(user, name);
  }

  @Post('create')
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  createCalendar(@CurrentUser() user: UserPayload, @Body() body: CalendarDto) {
    return this.calendarService.createCalendar(user, body);
  }

  @Patch('name/:name')
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  updateCalendar(
    @CurrentUser() user: UserPayload,
    @Param('name') name: string,
    @Body() body: CalendarDto,
  ) {
    return this.calendarService.updateCalendarByName(user, name, body);
  }

  @Patch('data/:name')
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  updateCalendarData(
    @CurrentUser() user: UserPayload,
    @Param('name') name: string,
    @Body() body: CalendarDataDto,
  ) {
    return this.calendarService.modifyCalendarData(user, name, body);
  }

  @Delete('delete')
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  deleteCalendar(@CurrentUser() user: UserPayload, @Body() body: CalendarDto) {
    return this.calendarService.deleteCalendarByName(user, body);
  }

  @Delete('all')
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  deleteAllCalendars(@CurrentUser() user: UserPayload) {
    return this.calendarService.deleteAllCalendars(user);
  }
}
