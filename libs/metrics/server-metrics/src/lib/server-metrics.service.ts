import { Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { ExceptionService } from '@fitmonitor/server-services';
import {
  Metrics,
  MetricsData,
  MetricsDataDocument,
  MetricsDocument,
  User,
  UserDocument,
} from '@fitmonitor/schemas';
import { InjectModel } from '@nestjs/mongoose';
import {
  MetricsDataDto,
  MetricsDto,
  MetricsUpdateDataDto,
  MetricsUpdateDto,
} from './dtos';
import {
  AuthExpectionKeys,
  ExceptionStatusKeys,
  GlobalExceptionKeys,
  MetricsExceptionKeys,
  UserPayload,
} from '@fitmonitor/interfaces';

@Injectable()
export class MetricsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Metrics.name) private metricsModel: Model<MetricsDocument>,
    @InjectModel(MetricsData.name)
    private metricsDataModel: Model<MetricsDataDocument>,
    private exceptionService: ExceptionService
  ) {}

  async getAllMetricFromUser(user: UserPayload) {
    const metrics = await this.metricsModel.find({ ownerID: user._id });
    return metrics;
  }

  async getMetricByName(user: UserPayload, name: string) {
    const metric = await this.metricsModel.findOne({ name, ownerID: user._id });

    if (!metric) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.NotFound,
        'Metric with given name not found',
        MetricsExceptionKeys.NotFound
      );
      return;
    }

    return metric;
  }

  async addMetric(user: UserPayload, body: MetricsDto) {
    const userExists = await this.userModel.exists({ _id: user._id });

    if (!userExists) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.NotFound,
        'User with given ID not found',
        AuthExpectionKeys.UserNotFound
      );
      return;
    }

    const metricExists = await this.metricsModel.exists({
      name: body.name,
      ownerID: user._id,
    });

    if (metricExists) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.Conflict,
        'Metric with given name already exists',
        MetricsExceptionKeys.NameAlreadyExists
      );
      return;
    }

    const metric = await this.metricsModel.create({
      name: body.name,
      desiredValue: body.desiredValue,
      ownerID: user._id,
      data: [],
    });

    return metric;
  }

  async addDataToMetric(user: UserPayload, name: string, body: MetricsDataDto) {
    const metric = await this.metricsModel.findOne({ name, ownerID: user._id });

    if (!metric) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.NotFound,
        'Metric with given name not found',
        MetricsExceptionKeys.NotFound
      );
      return;
    }

    const date = new Date(body.date);

    if (date.toString() === 'Invalid Date') {
      this.exceptionService.throwError(
        ExceptionStatusKeys.BadRequest,
        'Invalid date',
        MetricsExceptionKeys.InvalidDate
      );
      return;
    }

    const dataExists = metric.data.some(
      (data) => data.date === date.toISOString()
    );

    if (dataExists) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.Conflict,
        'Data with given date already exists',
        MetricsExceptionKeys.DateAlreadyExists
      );
      return;
    }

    const data = await this.metricsDataModel.create({
      value: body.value,
      date: date.toISOString(),
      desiredValueReached: body.value >= metric.desiredValue,
    });

    metric.data.push(data);

    // Each time date should be sorted, if the last date is
    // greater than the new date then sort otherwise it's already sorted
    if (
      new Date(metric.data[metric.data.length - 2].date).getTime() >
      date.getTime()
    ) {
      metric.data = metric.data.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    }

    await metric.save();
    return this.metricsModel.findOne({ name, ownerID: user._id });
  }

  async updateMetric(user: UserPayload, name: string, body: MetricsUpdateDto) {
    if (!body.name && !body.desiredValue) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.BadRequest,
        'Nothing to update',
        GlobalExceptionKeys.NothingToUpdate
      );
      return;
    }

    const update: Record<string, string | number> = {};

    if (body.name) {
      update['name'] = body.name;
    }

    if (body.desiredValue) {
      update['desiredValue'] = Number(body.desiredValue);

      if (isNaN(update['desiredValue'])) {
        this.exceptionService.throwError(
          ExceptionStatusKeys.BadRequest,
          'Desired value should be a number',
          MetricsExceptionKeys.ValueShouldBeNumber
        );
        return;
      }
    }

    const metricExists = await this.metricsModel.exists({
      name,
      ownerID: user._id,
    });

    if (!metricExists) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.NotFound,
        'Metric with given name not found',
        MetricsExceptionKeys.NotFound
      );
      return;
    }

    const metric = await this.metricsModel.findOneAndUpdate(
      {
        name,
        ownerID: user._id,
      },
      update,
      { new: true }
    );

    return metric;
  }

  async updateDataInMetric(
    user: UserPayload,
    name: string,
    id: string,
    body: MetricsUpdateDataDto
  ) {
    if (!body.value && !body.date) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.BadRequest,
        'Nothing to update',
        GlobalExceptionKeys.NothingToUpdate
      );
      return;
    }

    const update: Record<string, string | number | boolean> = {};

    if (body.value) {
      update['value'] = body.value;

      if (isNaN(update['value'])) {
        this.exceptionService.throwError(
          ExceptionStatusKeys.BadRequest,
          'Value should be a number',
          MetricsExceptionKeys.ValueShouldBeNumber
        );
        return;
      }
    }

    if (body.date) {
      const date = new Date(body.date);

      if (date.toString() === 'Invalid Date') {
        this.exceptionService.throwError(
          ExceptionStatusKeys.BadRequest,
          'Invalid date',
          MetricsExceptionKeys.InvalidDate
        );
        return;
      }

      update['date'] = date.toISOString();
    }

    const metric = await this.metricsModel.findOne({ name, ownerID: user._id });

    if (!metric) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.NotFound,
        'Metric with given name not found',
        MetricsExceptionKeys.NotFound
      );
      return;
    }

    const data = metric.data.find(
      (item) =>
        (
          item as {
            _id: mongoose.Types.ObjectId;
            value: number;
            date: string;
            desiredValueReached: boolean;
          }
        )._id.toString() === id
    );

    if (!data) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.NotFound,
        'Data with given ID not found',
        MetricsExceptionKeys.NotFound
      );
      return;
    }

    if (update['date']) {
      const dataExists = metric.data.some(
        (item) => item.date === update['date']
      );

      if (dataExists) {
        this.exceptionService.throwError(
          ExceptionStatusKeys.Conflict,
          'Data with given date already exists',
          MetricsExceptionKeys.DateAlreadyExists
        );
        return;
      }
    }

    if (update['value']) {
      data.value = update['value'] as number;
      data.desiredValueReached = data.value >= metric.desiredValue;
    }

    if (update['date']) {
      data.date = update['date'] as string;
    }

    metric.data = metric.data.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    await metric.save();
    return this.metricsModel.findOne({ name, ownerID: user._id });
  }

  async deleteMetric(user: UserPayload, name: string) {
    const metric = await this.metricsModel.findOneAndDelete({
      name,
      ownerID: user._id,
    });

    if (!metric) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.NotFound,
        'Metric with given name not found',
        MetricsExceptionKeys.NotFound
      );
      return;
    }

    return {
      acknowledged: true,
    };
  }

  async deleteDataFromMetric(user: UserPayload, name: string, id: string) {
    const metric = await this.metricsModel.findOne({ name, ownerID: user._id });

    if (!metric) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.NotFound,
        'Metric with given name not found',
        MetricsExceptionKeys.NotFound
      );
      return;
    }

    const index = metric.data.findIndex(
      (item) =>
        (
          item as {
            _id: mongoose.Types.ObjectId;
            value: number;
            date: string;
            desiredValueReached: boolean;
          }
        )._id.toString() === id
    );

    if (index === -1) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.NotFound,
        'Data with given ID not found',
        MetricsExceptionKeys.NotFound
      );
      return;
    }

    const length = metric.data.length;
    metric.data.splice(index, 1);

    if (index + 1 !== length) {
      metric.data = metric.data.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    }

    await metric.save();
    return this.metricsModel.findOne({ name, ownerID: user._id });
  }

  async deleteAllMetrics(user: UserPayload) {
    const metrics = await this.metricsModel.deleteMany({ ownerID: user._id });

    return {
      acknowledged: true,
      deletedCount: metrics.deletedCount,
    };
  }
}
