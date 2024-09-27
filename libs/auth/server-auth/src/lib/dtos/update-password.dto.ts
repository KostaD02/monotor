import { IsString, MaxLength, MinLength } from 'class-validator';
import { API_CONFIG } from '@fitmonitor/consts';
import { AuthExpectionKeys } from '@fitmonitor/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserPasswordDto {
  @ApiProperty({
    required: true,
    default: 'somestrongpassword123',
  })
  @IsString({ message: AuthExpectionKeys.InvalidOldPassword })
  oldPassword!: string;

  @ApiProperty({
    required: true,
    default: 'somestrongpassword1234',
  })
  @IsString({ message: AuthExpectionKeys.InvalidChangePassword })
  @MinLength(API_CONFIG.MIN_PASSWORD_LENGTH, {
    message: AuthExpectionKeys.PasswordTooShort,
  })
  @MaxLength(API_CONFIG.MAX_PASSWORD_LENGTH, {
    message: AuthExpectionKeys.PasswordTooLong,
  })
  newPassword!: string;
}
