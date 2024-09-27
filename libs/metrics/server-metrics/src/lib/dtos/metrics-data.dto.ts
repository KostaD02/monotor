import { IsString, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MetricsExceptionKeys } from '@fitmonitor/interfaces';

export class MetricsDataDto {
  @ApiProperty({
    required: true,
    default: '2024-09-27T16:07:47.496Z',
  })
  @IsString({
    message: MetricsExceptionKeys.DateShouldBeString,
  })
  date!: string;

  @ApiProperty({
    required: true,
    default: 1,
  })
  @IsNumber({}, { message: MetricsExceptionKeys.ValueTooLow })
  @IsPositive({ message: MetricsExceptionKeys.ValueShouldBeNumber })
  value!: number;
}
