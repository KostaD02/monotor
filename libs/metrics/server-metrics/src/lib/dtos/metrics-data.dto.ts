import { IsString, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MetricsExceptionKeys } from '@fitmonitor/interfaces';

export class MetricsDataDto {
  @ApiProperty({
    required: true,
  })
  @IsString({
    message: MetricsExceptionKeys.DateShouldBeString,
  })
  date!: string;

  @ApiProperty({
    required: true,
  })
  @IsNumber({}, { message: MetricsExceptionKeys.ValueTooLow })
  @IsPositive({ message: MetricsExceptionKeys.ValueShouldBeNumber })
  value!: number;
}
