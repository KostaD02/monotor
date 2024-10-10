import { API_CONFIG } from '@monotor/consts';
import { ScheduleExpceptionKeys } from '@monotor/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class ScheduleDto {
  @ApiProperty({
    required: false,
    default: 'workout',
  })
  @IsString({
    message: ScheduleExpceptionKeys.NameShouldBeString,
  })
  @MinLength(API_CONFIG.MIN_CALENDAR_NAME_LENGTH, {
    message: ScheduleExpceptionKeys.NameTooShort,
  })
  @MaxLength(API_CONFIG.MAX_CALENDAR_NAME_LENGTH, {
    message: ScheduleExpceptionKeys.NameTooLong,
  })
  name!: string;
}
