import { Injectable } from '@nestjs/common';
import {
  Calendar,
  CalendarData,
  CalendarDataDocument,
  CalendarDocument,
  User,
  UserDocument,
} from '@fitmonitor/schemas';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ExceptionService } from '@fitmonitor/server-services';
import {
  AuthExpectionKeys,
  CalendarExceptionKeys,
  ExceptionStatusKeys,
  UserPayload,
} from '@fitmonitor/interfaces';
import { CalendarDto } from './dtos';

@Injectable()
export class CalendarService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Calendar.name)
    private readonly calendarModel: Model<CalendarDocument>,
    @InjectModel(CalendarData.name)
    private readonly calendarDataModel: Model<CalendarDataDocument>,
    private readonly exceptionService: ExceptionService,
  ) {}

  async createCalendar(user: UserPayload, body: CalendarDto) {
    const userExists = await this.userModel.exists({ _id: user._id });

    if (!userExists) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.NotFound,
        'User not found',
        AuthExpectionKeys.UserNotFound,
      );
      return;
    }

    const calendarExists = await this.calendarModel.exists({
      name: body.name,
      ownerID: user._id,
    });

    if (calendarExists) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.Conflict,
        'Calendar already exists',
        CalendarExceptionKeys.NameAlreadyExists,
      );
      return;
    }

    const calendar = await this.calendarModel.create({
      name: body.name,
      ownerID: user._id,
      data: {
        mon: '',
        tue: '',
        wed: '',
        thu: '',
        fri: '',
        sat: '',
        sun: '',
      },
    });

    return calendar;
  }

  async getCalendars(user: UserPayload) {
    const userExists = await this.userModel.exists({ _id: user._id });

    if (!userExists) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.NotFound,
        'User not found',
        AuthExpectionKeys.UserNotFound,
      );
      return;
    }

    const calendars = await this.calendarModel.find({ ownerID: user._id });

    return calendars;
  }

  async getCalendarByName(user: UserPayload, name: string) {
    const userExists = await this.userModel.exists({ _id: user._id });

    if (!userExists) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.NotFound,
        'User not found',
        AuthExpectionKeys.UserNotFound,
      );
      return;
    }

    const calendar = await this.calendarModel.findOne({
      ownerID: user._id,
      name,
    });

    if (!calendar) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.NotFound,
        'Calendar not found',
        CalendarExceptionKeys.NotFound,
      );
      return;
    }

    return calendar;
  }

  async updateCalendarByName(
    user: UserPayload,
    name: string,
    body: CalendarDto,
  ) {
    const userExists = await this.userModel.exists({ _id: user._id });

    if (!userExists) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.NotFound,
        'User not found',
        AuthExpectionKeys.UserNotFound,
      );
      return;
    }

    const calendar = await this.calendarModel.findOne({
      ownerID: user._id,
      name,
    });

    if (!calendar) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.NotFound,
        'Calendar not found',
        CalendarExceptionKeys.NotFound,
      );
      return;
    }

    await this.calendarModel.updateOne(
      { ownerID: user._id, name },
      { name: body.name },
    );

    return await this.calendarModel.findOne({
      ownerID: user._id,
      name: body.name,
    });
  }

  async deleteCalendarByName(user: UserPayload, body: CalendarDto) {
    const userExists = await this.userModel.exists({ _id: user._id });

    if (!userExists) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.NotFound,
        'User not found',
        AuthExpectionKeys.UserNotFound,
      );
      return;
    }

    const calendar = await this.calendarModel.findOne({
      ownerID: user._id,
      name: body.name,
    });

    if (!calendar) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.NotFound,
        'Calendar not found',
        CalendarExceptionKeys.NotFound,
      );
      return;
    }

    await this.calendarModel.deleteOne({ ownerID: user._id, name: body.name });

    return {
      acknowledged: true,
    };
  }

  async deleteAllCalendars(user: UserPayload) {
    const userExists = await this.userModel.exists({ _id: user._id });

    if (!userExists) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.NotFound,
        'User not found',
        AuthExpectionKeys.UserNotFound,
      );
      return;
    }

    return this.calendarModel.deleteMany({
      ownerID: user._id,
    });
  }

  async modifyCalendarData(
    user: UserPayload,
    name: string,
    body: CalendarData,
  ) {
    const userExists = await this.userModel.exists({ _id: user._id });

    if (!userExists) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.NotFound,
        'User not found',
        AuthExpectionKeys.UserNotFound,
      );
      return;
    }

    const calendar = await this.calendarModel.findOne({
      ownerID: user._id,
      name,
    });

    if (!calendar) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.NotFound,
        'Calendar not found',
        CalendarExceptionKeys.NotFound,
      );
      return;
    }

    const weeks = this.getWeeks(body);

    for (const week in weeks) {
      calendar.data[week] = weeks[week];
    }

    await calendar.save();
    return this.calendarModel.findOne({ ownerID: user._id, name });
  }

  private getWeeks(body: CalendarData): Record<string, string> {
    const weeks: Record<string, string> = {};

    const haveValue = (value: string) => {
      return value || value === '';
    };

    if (haveValue(body.mon)) {
      weeks['mon'] = body.mon;
    }

    if (haveValue(body.tue)) {
      weeks['tue'] = body.tue;
    }

    if (haveValue(body.wed)) {
      weeks['wed'] = body.wed;
    }

    if (haveValue(body.thu)) {
      weeks['thu'] = body.thu;
    }

    if (haveValue(body.fri)) {
      weeks['fri'] = body.fri;
    }

    if (haveValue(body.sat)) {
      weeks['sat'] = body.sat;
    }

    if (haveValue(body.sun)) {
      weeks['sun'] = body.sun;
    }

    return weeks;
  }
}
