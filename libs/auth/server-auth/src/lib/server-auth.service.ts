import {
  AuthExpectionKeys,
  ExceptionStatusKeys,
  UserPayload,
  UserRole,
  User as UserInterface,
  StorageKeys,
} from '@monotor/interfaces';
import {
  Calendar,
  Metrics,
  Schedule,
  User,
  UserDocument,
} from '@monotor/schemas';
import {
  ExceptionService,
  EncryptionService,
  MongooseValidatorService,
} from '@monotor/server-services';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Model } from 'mongoose';

import {
  ForceAdminDto,
  SignUpDto,
  UpdateUserByIdDto,
  UpdateUserDto,
  UpdateUserPasswordDto,
} from './dtos';
import { Logger, LoggerSide } from '@monotor/util';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Metrics.name) private readonly metricsModel: Model<Metrics>,
    @InjectModel(Calendar.name) private readonly calendarModel: Model<Calendar>,
    @InjectModel(Schedule.name) private readonly scheduleModel: Model<Schedule>,
    private readonly exceptionService: ExceptionService,
    private readonly encryptionService: EncryptionService,
    private readonly jwtService: JwtService,
    private readonly mongooseValidator: MongooseValidatorService,
  ) {}

  async getCurrentUser(payload: UserPayload) {
    const user = await this.userModel.findOne({ _id: payload._id });

    if (!user) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.NotFound,
        'User not found',
        AuthExpectionKeys.UserNotFound,
      );
    }

    return this.createPayload(user as unknown as UserInterface);
  }

  async signUp(body: SignUpDto) {
    const userExsists = await this.userModel.findOne({ email: body.email });
    if (userExsists) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.Conflict,
        'Email is already in use',
        AuthExpectionKeys.EmailInUse,
      );
    }

    const hashedPassword = await this.encryptionService.hash(body.password);
    const isAdminRegistered = await this.isAdminRegistered();

    const user = await this.userModel.create({
      ...body,
      password: hashedPassword,
      role: isAdminRegistered ? UserRole.Default : UserRole.Admin,
    });

    return this.createPayload(user as unknown as UserInterface);
  }

  async isAdminRegistered() {
    const count = await this.userModel.countDocuments({ role: UserRole.Admin });
    return count >= 1;
  }

  async validateUser(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (
      user &&
      (await this.encryptionService.compareHash(password, user.password))
    ) {
      return this.createPayload(user as unknown as UserInterface);
    }
    return null;
  }

  async signIn(user: UserPayload, response: Response) {
    const accessToken = this.jwtService.sign(user);
    const refreshToken = this.jwtService.sign(user, { expiresIn: '7d' });
    response.cookie('access_token', accessToken, {
      expires: new Date(
        Date.now() + Number(process.env['JWT_EXPIRES_IN']) * 60 * 60 * 1000,
      ),
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
    response.cookie('refresh_token', refreshToken, {
      expires: new Date(
        Date.now() +
          Number(process.env['JWT_EXPIRES_IN']) * 7 * 24 * 60 * 60 * 1000,
      ),
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async forceAdmin(user: UserPayload, body: ForceAdminDto) {
    const userModel = await this.userModel.findOne({ email: user.email });

    if (!userModel) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.BadRequest,
        `User with this '${user.email}' does not exist`,
        AuthExpectionKeys.UserNotFound,
      );
      return;
    }

    if (userModel.role === UserRole.Admin) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.BadRequest,
        `User with this '${user.email}' is already an admin`,
        AuthExpectionKeys.UserIsAlreadyAdmin,
      );
      return;
    }

    const force = process.env['FORCE_ADMIN_MODE_ENABLED'] || false;

    if (!force) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.BadRequest,
        `Force admin is not enabled 😢`,
        AuthExpectionKeys.UserPermissionNotGranted,
      );
      Logger.warn(
        `${user.email} tried to force admin without permission`,
        LoggerSide.Server,
      );
      return;
    }

    if (body.secretCode !== StorageKeys.Secret) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.BadRequest,
        `Secret code is incorrect`,
        AuthExpectionKeys.SecretCodeShouldBeString,
      );
      return;
    }

    userModel.role = UserRole.Admin;
    await userModel.save();
    return this.createPayload(userModel as unknown as UserInterface);
  }

  async refreshToken(response: Response) {
    let refreshToken = response.getHeader('refresh_token') as string;
    if (!refreshToken) {
      refreshToken = response.req.cookies['refresh_token'];
    }
    if (!refreshToken) {
      refreshToken = response.req.body.refresh_token;
    }
    if (!refreshToken) {
      refreshToken = response.req.headers['refresh_token'] as string;
    }
    if (!refreshToken) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.BadRequest,
        'Refresh token not found',
        AuthExpectionKeys.TokenNotFound,
      );
    }
    const data = this.jwtService.decode(refreshToken) as UserPayload;
    const user = await this.userModel.findOne({ email: data.email });
    const accessToken = this.jwtService.sign(
      this.createPayload(user as unknown as UserInterface),
    );
    response.cookie('access_token', accessToken, {
      expires: new Date(
        Date.now() + Number(process.env['JWT_EXPIRES_IN']) * 60 * 60 * 1000,
      ),
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
    return {
      access_token: accessToken,
    };
  }

  async updateUser(userPayload: UserPayload, body: UpdateUserDto) {
    if (!body.firstName && !body.lastName) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.BadRequest,
        `Nothing to update, provide at least one property`,
        AuthExpectionKeys.NothingToUpdate,
      );
    }
    const user = await this.userModel.findOneAndUpdate(
      { email: userPayload.email },
      {
        firstName: body.firstName,
        lastName: body.lastName,
      },
    );

    const updatedUser = await this.userModel.findOne({ _id: user?.id });

    return this.createPayload(updatedUser as unknown as UserInterface);
  }

  async updateUserById(id: string, body: UpdateUserByIdDto) {
    if (
      !body.firstName &&
      !body.lastName &&
      !body.email &&
      !body.password &&
      body.makeAdmin === undefined
    ) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.BadRequest,
        `Nothing to update, provide at least one property`,
        AuthExpectionKeys.NothingToUpdate,
      );
    }

    const data: Record<string, string> = {};

    if (body.firstName) {
      data['firstName'] = body.firstName;
    }

    if (body.lastName) {
      data['lastName'] = body.lastName;
    }

    if (body.email) {
      data['email'] = body.email;
    }

    if (body.password) {
      data['password'] = await this.encryptionService.hash(body.password);
    }

    if (body.makeAdmin) {
      data['role'] = body.makeAdmin ? UserRole.Admin : UserRole.Default;
    } else {
      data['role'] = UserRole.Default;
    }

    if (data['email']) {
      if (await this.userModel.exists({ email: data['email'] })) {
        this.exceptionService.throwError(
          ExceptionStatusKeys.Conflict,
          `Email is already in use`,
          AuthExpectionKeys.EmailInUse,
        );
      }
    }

    const user = await this.userModel.findOneAndUpdate(
      { _id: id },
      { ...data },
      { new: true },
    );
    return user;
  }

  async updateUserPassword(
    userPayload: UserPayload,
    body: UpdateUserPasswordDto,
    response: Response,
  ) {
    if (body.newPassword === body.oldPassword) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.BadRequest,
        `Old and new passwords can not be same`,
        AuthExpectionKeys.NewPasswordMatchesOld,
      );
    }

    const user = await this.userModel.findOne({ email: userPayload.email });

    if (user === null) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.BadRequest,
        `User not found`,
        AuthExpectionKeys.UserNotFound,
      );
      return;
    }

    const isCorrect = await this.encryptionService.compareHash(
      body.oldPassword,
      user.password,
    );

    if (!isCorrect) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.BadRequest,
        `Old password is incorrect`,
        AuthExpectionKeys.OldPasswordIncorrect,
      );
    }

    const hashedPassword = await this.encryptionService.hash(body.newPassword);
    user.password = hashedPassword;
    await user.save();

    return this.signIn(
      this.createPayload(user as unknown as UserInterface),
      response,
    );
  }

  async deleteCurrentUser(userPayload: UserPayload) {
    const user = await this.userModel.findOneAndDelete({
      email: userPayload.email,
    });

    if (!user) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.BadRequest,
        `User already deleted`,
        AuthExpectionKeys.UserAlreadyDeleted,
      );
    }

    await this.deleteAllConnection(user as unknown as UserPayload);

    return {
      acknowledged: true,
    };
  }

  async getUserByID(userPayload: UserPayload, id: string) {
    if (userPayload._id === id) {
      return this.createPayload(userPayload as unknown as UserInterface);
    }

    this.mongooseValidator.isValidObjectId(id);
    const user = await this.userModel.findOne({ _id: id });

    if (!user) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.BadRequest,
        `User with this '${id}' does not exist`,
        AuthExpectionKeys.UserNotFound,
      );
    }

    return this.createPayload(user as unknown as UserInterface);
  }

  async getAllUser() {
    const users = await this.userModel.find({});
    return users.map((user) =>
      this.createPayload(user as unknown as UserInterface),
    );
  }

  async deleteUserById(id: string) {
    const userExists = await this.userModel.exists({ _id: id });
    if (!userExists) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.BadRequest,
        `User with this '${id}' does not exist`,
        AuthExpectionKeys.UserNotFound,
      );
    }

    const user = await this.userModel.findOneAndDelete({
      _id: id,
    });

    if (!user) {
      this.exceptionService.throwError(
        ExceptionStatusKeys.BadRequest,
        `User already deleted`,
        AuthExpectionKeys.UserAlreadyDeleted,
      );
    }

    await this.deleteAllConnection(user as unknown as UserPayload);

    return {
      acknowledged: true,
    };
  }

  private createPayload(user: UserInterface) {
    return {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private async deleteAllConnection(user: UserPayload) {
    await this.metricsModel.deleteMany({ user: user._id });
    await this.calendarModel.deleteMany({ user: user._id });
    await this.scheduleModel.deleteMany({ user: user._id });
  }
}
