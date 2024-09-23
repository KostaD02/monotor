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
import { MetricsService } from './server-metrics.service';
import { UserPayload } from '@fitmonitor/interfaces';
import { JwtGuard } from '@fitmonitor/server-guards';
import { CurrentUserInterceptor } from '@fitmonitor/server-interceptors';
import { CurrentUser } from '@fitmonitor/server-decorators';
import {
  MetricsDataDto,
  MetricsDto,
  MetricsUpdateDataDto,
  MetricsUpdateDto,
} from './dtos';

@ApiTags('Metrics')
@Controller('metrics')
export class MetricsController {
  constructor(private metricsService: MetricsService) {}

  @Get('all')
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  getCurrentUser(@CurrentUser() user: UserPayload) {
    return this.metricsService.getAllMetricFromUser(user);
  }

  @Get('name/:name')
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  getMetricByName(@CurrentUser() user: UserPayload, name: string) {
    return this.metricsService.getMetricByName(user, name);
  }

  @Post('add')
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  addMetric(@CurrentUser() user: UserPayload, @Body() body: MetricsDto) {
    return this.metricsService.addMetric(user, body);
  }

  @Post('add-data/:name')
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  addDataToMetric(
    @CurrentUser() user: UserPayload,
    @Body() body: MetricsDataDto,
    @Param('name') name: string
  ) {
    return this.metricsService.addDataToMetric(user, name, body);
  }

  @Patch('update/:name')
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  updateMetric(
    @CurrentUser() user: UserPayload,
    @Body() body: MetricsUpdateDto,
    @Param('name') name: string
  ) {
    return this.metricsService.updateMetric(user, name, body);
  }

  @Patch('update-data/:name/:id')
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  updateDataInMetric(
    @CurrentUser() user: UserPayload,
    @Body() body: MetricsUpdateDataDto,
    @Param('name') name: string,
    @Param('id') id: string
  ) {
    return this.metricsService.updateDataInMetric(user, name, id, body);
  }

  @Delete('delete/:name')
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  deleteMetric(@CurrentUser() user: UserPayload, @Param('name') name: string) {
    return this.metricsService.deleteMetric(user, name);
  }

  @Delete('delete-data/:name/:id')
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  deleteDataFromMetric(
    @CurrentUser() user: UserPayload,
    @Param('name') name: string,
    @Param('id') id: string
  ) {
    return this.metricsService.deleteDataFromMetric(user, name, id);
  }

  @Delete('all')
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  deleteAllMetrics(@CurrentUser() user: UserPayload) {
    return this.metricsService.deleteAllMetrics(user);
  }
}
