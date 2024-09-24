import { IsString, MaxLength, MinLength } from 'class-validator';
import { CalendarExceptionKeys } from '@fitmonitor/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { API_CONFIG } from '@fitmonitor/consts';

export class CalendarDto {
  @ApiProperty({
    required: false,
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
