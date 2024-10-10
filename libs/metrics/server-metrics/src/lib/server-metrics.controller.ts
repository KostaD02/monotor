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
import { UserPayload } from '@monotor/interfaces';
import { JwtGuard } from '@monotor/server-guards';
import { CurrentUserInterceptor } from '@monotor/server-interceptors';
import { CurrentUser } from '@monotor/server-decorators';
import { MongooseValidatorService } from '@monotor/server-services';
import {
  MetricsDataDto,
  MetricsDeleteDto,
  MetricsDto,
  MetricsUpdateDataDto,
  MetricsUpdateDto,
} from './dtos';

@ApiTags('Metrics')
@Controller('metrics')
export class MetricsController {
  constructor(
    private readonly metricsService: MetricsService,
    private readonly mongooseValidator: MongooseValidatorService,
  ) {}

  @Get('all')
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  getCurrentUser(@CurrentUser() user: UserPayload) {
    return this.metricsService.getAllMetricFromUser(user);
  }

  @Get('name/:name')
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  getMetricByName(
    @CurrentUser() user: UserPayload,
    @Param('name') name: string,
  ) {
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
    @Param('name') name: string,
  ) {
    return this.metricsService.addDataToMetric(user, name, body);
  }

  @Patch('update/:name')
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  updateMetric(
    @CurrentUser() user: UserPayload,
    @Body() body: MetricsUpdateDto,
    @Param('name') name: string,
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
    @Param('id') id: string,
  ) {
    this.mongooseValidator.isValidObjectId(id);
    return this.metricsService.updateDataInMetric(user, name, id, body);
  }

  @Delete('delete')
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  deleteMetric(
    @CurrentUser() user: UserPayload,
    @Body() body: MetricsDeleteDto,
  ) {
    return this.metricsService.deleteMetric(user, body);
  }

  @Delete('delete-data/:name/:id')
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  deleteDataFromMetric(
    @CurrentUser() user: UserPayload,
    @Param('name') name: string,
    @Param('id') id: string,
  ) {
    this.mongooseValidator.isValidObjectId(id);
    return this.metricsService.deleteDataFromMetric(user, name, id);
  }

  @Delete('all')
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  deleteAllMetrics(@CurrentUser() user: UserPayload) {
    return this.metricsService.deleteAllMetrics(user);
  }
}
