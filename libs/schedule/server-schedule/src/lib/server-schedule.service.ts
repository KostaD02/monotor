import {
  AuthExpectionKeys,
  ExceptionStatusKeys,
  ScheduleExpceptionKeys,
  UserPayload,
} from '@monotor/interfaces';
import {
  User,
  UserDocument,
  ScheduleDocument,
  ScheduleData,
  ScheduleDataDocument,
  Schedule,
} from '@monotor/schemas';
import { ExceptionService } from '@monotor/server-services';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ScheduleDataDto, ScheduleDto } from './dtos';
import { isObjectEmpty, isValidTime } from '@monotor/util';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Schedule.name) private scheduleModel: Model<ScheduleDocument>,
    @InjectModel(ScheduleData.name)
    private scheduleDataModel: Model<ScheduleDataDocument>,
    private exceptionService: ExceptionService,
  ) {}

  async getAllSchedule(user: UserPayload) {
    return this.scheduleModel.find({ ownerID: user._id });
  }

  async getScheduleByName(user: UserPayload, name: string) {
    this.userExists(user);
    const schedule = await this.scheduleModel.findOne({
      name,
      ownerID: user._id,
    });

    if (!schedule) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.NotFound,
        'Schedule with given name not found',
        ScheduleExpceptionKeys.NotFound,
      );
      return;
    }

    return schedule;
  }

  async createSchedule(user: UserPayload, body: ScheduleDto) {
    this.userExists(user);
    const scheduleExists = await this.scheduleModel.exists({
      name: body.name,
      ownerID: user._id,
    });

    if (scheduleExists) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.Conflict,
        'Schedule with given name already exists',
        ScheduleExpceptionKeys.NameAlreadyExists,
      );
      return;
    }

    const schedule = await this.scheduleModel.create({
      name: body.name,
      ownerID: user._id,
      data: {
        mon: {},
        tue: {},
        wed: {},
        thu: {},
        fri: {},
        sat: {},
        sun: {},
      },
    });

    return schedule;
  }

  async updateScheduleByName(
    user: UserPayload,
    name: string,
    body: ScheduleDto,
  ) {
    this.userExists(user);
    const schedule = await this.scheduleModel.findOne({
      name,
      ownerID: user._id,
    });

    if (!schedule) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.NotFound,
        'Schedule with given name not found',
        ScheduleExpceptionKeys.NotFound,
      );
      return;
    }

    await this.scheduleModel.updateOne(
      { name, ownerID: user._id },
      { name: body.name },
    );

    return this.scheduleModel.findOne({ name: body.name, ownerID: user._id });
  }

  async modifyScheduleByName(
    user: UserPayload,
    name: string,
    body: ScheduleDataDto,
  ) {
    if (isObjectEmpty(body)) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.BadRequest,
        'No data provided to modify',
        ScheduleExpceptionKeys.NoDataProvided,
      );
      return;
    }

    this.userExists(user);
    const schedule = await this.scheduleModel.findOne({
      name,
      ownerID: user._id,
    });

    if (!schedule) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.NotFound,
        'Schedule with given name not found',
        ScheduleExpceptionKeys.NotFound,
      );
      return;
    }

    const isDuplicate = body.duplicate || false;
    let filledWeek = '';

    const data: Record<string, object> = {};

    if (!isObjectEmpty(body?.mon || {})) {
      data['mon'] = body.mon;
    }

    if (!isObjectEmpty(body?.tue || {})) {
      data['tue'] = body.tue;
    }

    if (!isObjectEmpty(body?.wed || {})) {
      data['wed'] = body.wed;
    }

    if (!isObjectEmpty(body?.thu || {})) {
      data['thu'] = body.thu;
    }

    if (!isObjectEmpty(body?.fri || {})) {
      data['fri'] = body.fri;
    }

    if (!isObjectEmpty(body?.sat || {})) {
      data['sat'] = body.sat;
    }

    if (!isObjectEmpty(body?.sun || {})) {
      data['sun'] = body.sun;
    }

    for (const key in data) {
      const week = data[key];
      for (const name in week) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (week[name] && !isObjectEmpty(week)) {
          filledWeek = key;
          if (!isValidTime(name)) {
            this.exceptionService.throwError(
              ExceptionStatusKeys.BadRequest,
              'Invalid time provided (HH:MM)',
              ScheduleExpceptionKeys.ProvidedDateIsIncorrecrtFormat,
            );
            return;
          }
        }
      }
    }

    if (!filledWeek) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.BadRequest,
        'No data provided to modify',
        ScheduleExpceptionKeys.NoDataProvided,
      );
      return;
    }

    if (isDuplicate) {
      const weeks = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
      weeks
        .filter((week) => week !== filledWeek)
        .forEach((week) => {
          data[week] = {};
        });
      for (const key in data) {
        if (key === filledWeek) {
          continue;
        }

        data[key] = data[filledWeek];
      }
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    schedule.data = data;
    await schedule.save();

    return schedule;
  }

  async clearScheduleByName(user: UserPayload, name: string) {
    this.userExists(user);
    const schedule = await this.scheduleModel.findOne({
      name,
      ownerID: user._id,
    });

    if (!schedule) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.NotFound,
        'Schedule with given name not found',
        ScheduleExpceptionKeys.NotFound,
      );
      return;
    }

    schedule.data = {
      mon: {},
      tue: {},
      wed: {},
      thu: {},
      fri: {},
      sat: {},
      sun: {},
    };

    await schedule.save();
    return schedule;
  }

  async deleteScheduleByName(user: UserPayload, name: string) {
    this.userExists(user);

    const scheduleExists = await this.scheduleModel.exists({
      ownerID: user._id,
      name,
    });

    if (!scheduleExists) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.NotFound,
        'Schedule with given name not found',
        ScheduleExpceptionKeys.NotFound,
      );
      return;
    }

    return this.scheduleModel.deleteOne({ ownerID: user._id, name });
  }

  async deleteAllSchedule(user: UserPayload) {
    this.userExists(user);

    return this.scheduleModel.deleteMany({ ownerID: user._id });
  }

  private async userExists(user: UserPayload) {
    const exists = await this.userModel.exists({ _id: user._id });

    if (!exists) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.NotFound,
        'User with given ID not found',
        AuthExpectionKeys.UserNotFound,
      );
      return;
    }
  }
}
