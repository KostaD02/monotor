import {
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { API_CONFIG } from '@fitmonitor/consts';
import { MetricsExceptionKeys } from '@fitmonitor/interfaces';

export class MetricsDto {
  @ApiProperty({
    required: true,
    default: 'workout',
  })
  @IsString({
    message: MetricsExceptionKeys.NameShouldBeString,
  })
  @MinLength(API_CONFIG.MIN_METRICS_NAME_LENGTH, {
    message: MetricsExceptionKeys.NameTooShort,
  })
  @MaxLength(API_CONFIG.MAX_METRICS_NAME_LENGTH, {
    message: MetricsExceptionKeys.NameTooLong,
  })
  name!: string;

  @ApiProperty({
    required: true,
    default: 22,
  })
  @IsNumber({}, { message: MetricsExceptionKeys.ValueShouldBeNumber })
  @IsPositive({ message: MetricsExceptionKeys.ValueShouldBeNumber })
  desiredValue!: number;
}
