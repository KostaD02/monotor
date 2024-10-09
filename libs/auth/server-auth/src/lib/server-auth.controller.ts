import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Res,
  Param,
  Patch,
  UseInterceptors,
  Delete,
} from '@nestjs/common';
import { AuthService } from './server-auth.service';
import {
  SignInDto,
  SignUpDto,
  UpdateUserByIdDto,
  UpdateUserDto,
  UpdateUserPasswordDto,
} from './dtos';
import { LocalAuthGuard, RefreshJwtGuard } from './guards';
import { Response } from 'express';

import { JwtGuard } from '@fitmonitor/server-guards';
import { CurrentUserInterceptor } from '@fitmonitor/server-interceptors';
import { CurrentUser, Roles } from '@fitmonitor/server-decorators';

import { UserPayload, UserRole } from '@fitmonitor/interfaces';
import { ApiTags } from '@nestjs/swagger';
import { MongooseValidatorService } from '@fitmonitor/server-services';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mongooseValidator: MongooseValidatorService,
  ) {}

  @Get()
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  getCurrentUser(@CurrentUser() user: UserPayload) {
    return this.authService.getCurrentUser(user);
  }

  @Get('id/:id')
  @UseGuards(JwtGuard)
  @Roles(UserRole.Admin)
  @UseInterceptors(CurrentUserInterceptor)
  getUserByID(@CurrentUser() user: UserPayload, @Param('id') id: string) {
    this.mongooseValidator.isValidObjectId(id);
    return this.authService.getUserByID(user, id);
  }

  @Get('all')
  @UseGuards(JwtGuard)
  @Roles(UserRole.Admin)
  getAllUser() {
    return this.authService.getAllUser();
  }

  @Post('sign_up')
  signUp(@Body() body: SignUpDto) {
    return this.authService.signUp(body);
  }

  @Post('sign_in')
  @UseGuards(LocalAuthGuard)
  signIn(
    @CurrentUser() user: UserPayload,
    @Res({ passthrough: true }) response: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() dto: SignInDto,
  ) {
    return this.authService.signIn(user, response);
  }

  @Post('sign_out')
  logout() {
    // TODO: handle logout after token block list is added
    return {
      message: "it's not implemented yet. will be added soon",
    };
  }

  @Post('refresh')
  @UseGuards(RefreshJwtGuard)
  refreshToken(@Res({ passthrough: true }) response: Response) {
    return this.authService.refreshToken(response);
  }

  @Patch('update')
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  updateUser(@CurrentUser() user: UserPayload, @Body() body: UpdateUserDto) {
    return this.authService.updateUser(user, body);
  }

  @Patch('update/:id')
  @UseGuards(JwtGuard)
  @Roles(UserRole.Admin)
  @UseInterceptors(CurrentUserInterceptor)
  updateUserById(@Param('id') id: string, @Body() body: UpdateUserByIdDto) {
    this.mongooseValidator.isValidObjectId(id);
    return this.authService.updateUserById(id, body);
  }

  @Patch('change_password')
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  updateUserPassword(
    @CurrentUser() user: UserPayload,
    @Body() body: UpdateUserPasswordDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.updateUserPassword(user, body, response);
  }

  @Delete('delete')
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  deleteCurrentUser(@CurrentUser() user: UserPayload) {
    return this.authService.deleteCurrentUser(user);
  }

  @Delete('delete/:id')
  @UseGuards(JwtGuard)
  @Roles(UserRole.Admin)
  deleteUser(@Param('id') id: string) {
    this.mongooseValidator.isValidObjectId(id);
    return this.authService.deleteUserById(id);
  }
}
