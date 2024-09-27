import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { API_CONFIG } from '@fitmonitor/consts';
import { AuthExpectionKeys } from '@fitmonitor/interfaces';

export class UpdateUserDto {
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
}
