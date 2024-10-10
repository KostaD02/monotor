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
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@monotor/server-guards';
import { CurrentUserInterceptor } from '@monotor/server-interceptors';
import { CurrentUser } from '@monotor/server-decorators';
import { UserPayload } from '@monotor/interfaces';
import { ScheduleService } from './server-schedule.service';
import { ScheduleDataDto, ScheduleDto } from './dtos';

@ApiTags('Schedule')
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get('all')
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  getAllSchedule(@CurrentUser() user: UserPayload) {
    return this.scheduleService.getAllSchedule(user);
  }

  @Get('name/:name')
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  getScheduleByName(
    @CurrentUser() user: UserPayload,
    @Param('name') name: string,
  ) {
    return this.scheduleService.getScheduleByName(user, name);
  }

  @Post('create')
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  createSchedule(@CurrentUser() user: UserPayload, @Body() body: ScheduleDto) {
    return this.scheduleService.createSchedule(user, body);
  }

  @Patch('update/:name')
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  updateSchedule(
    @CurrentUser() user: UserPayload,
    @Body() body: ScheduleDto,
    @Param('name') name: string,
  ) {
    return this.scheduleService.updateScheduleByName(user, name, body);
  }

  @Patch('modify/:name')
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  modifySchedule(
    @CurrentUser() user: UserPayload,
    @Body() body: ScheduleDataDto,
    @Param('name') name: string,
  ) {
    return this.scheduleService.modifyScheduleByName(user, name, body);
  }

  @Patch('clear/:name')
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  clearSchedule(@CurrentUser() user: UserPayload, @Param('name') name: string) {
    return this.scheduleService.clearScheduleByName(user, name);
  }

  @Delete('delete/:name')
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  deleteSchedule(
    @CurrentUser() user: UserPayload,
    @Param('name') name: string,
  ) {
    return this.scheduleService.deleteScheduleByName(user, name);
  }

  @Delete('all')
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  deleteAllSchedule(@CurrentUser() user: UserPayload) {
    return this.scheduleService.deleteAllSchedule(user);
  }
}
