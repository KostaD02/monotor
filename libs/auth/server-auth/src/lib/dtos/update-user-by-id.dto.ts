import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsEmail,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { API_CONFIG } from '@fitmonitor/consts';
import { AuthExpectionKeys } from '@fitmonitor/interfaces';

export class UpdateUserByIdDto {
  @IsOptional()
  @ApiProperty({
    required: false,
    default: 'konstantine',
  })
  @IsString({
    message: AuthExpectionKeys.FirstnameShouldBeString,
  })
  @MinLength(API_CONFIG.MIN_FIRSTNAME_LENGTH, {
    message: AuthExpectionKeys.FirstnameTooShort,
  })
  @MaxLength(API_CONFIG.MAX_FIRSTNAME_LENGTH, {
    message: AuthExpectionKeys.LastnameTooLong,
  })
  firstName!: string;

  @IsOptional()
  @ApiProperty({
    required: false,
    default: 'datunishvili',
  })
  @IsString({
    message: AuthExpectionKeys.LastnameShouldBeString,
  })
  @MinLength(API_CONFIG.MIN_LASTNAME_LENGTH, {
    message: AuthExpectionKeys.LastnameTooShort,
  })
  @MaxLength(API_CONFIG.MAX_LASTNAME_LENGTH, {
    message: AuthExpectionKeys.LastnameTooLong,
  })
  lastName!: string;

  @IsOptional()
  @ApiProperty({
    required: false,
    default: 'konstantine@datunishvili.ge',
  })
  @IsEmail({}, { message: AuthExpectionKeys.InvalidEmail })
  email!: string;

  @IsOptional()
  @ApiProperty({
    required: false,
    default: 'somestrongpassword123',
  })
  @IsString({ message: AuthExpectionKeys.InvalidChangePassword })
  @MinLength(API_CONFIG.MIN_PASSWORD_LENGTH, {
    message: AuthExpectionKeys.PasswordTooShort,
  })
  @MaxLength(API_CONFIG.MAX_PASSWORD_LENGTH, {
    message: AuthExpectionKeys.PasswordTooLong,
  })
  password!: string;

  @IsOptional()
  @ApiProperty({
    required: false,
    default: true,
  })
  @IsBoolean({
    message: AuthExpectionKeys.MakeAdminShouldBeBoolean,
  })
  makeAdmin!: boolean;
}
