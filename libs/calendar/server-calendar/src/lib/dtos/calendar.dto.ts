import { IsString, MaxLength, MinLength } from 'class-validator';
import { CalendarExceptionKeys } from '@monotor/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { API_CONFIG } from '@monotor/consts';

export class CalendarDto {
  @ApiProperty({
    required: false,
    default: 'workout',
  })
  @IsString({
    message: CalendarExceptionKeys.NameShouldBeString,
  })
  @MinLength(API_CONFIG.MIN_CALENDAR_NAME_LENGTH, {
    message: CalendarExceptionKeys.NameTooShort,
  })
  @MaxLength(API_CONFIG.MAX_CALENDAR_NAME_LENGTH, {
    message: CalendarExceptionKeys.NameTooLong,
  })
  name!: string;
}
