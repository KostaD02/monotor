import { IsString, IsNumber, IsPositive, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MetricsExceptionKeys } from '@fitmonitor/interfaces';

export class MetricsUpdateDataDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({
    message: MetricsExceptionKeys.DateShouldBeString,
  })
  date!: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: MetricsExceptionKeys.ValueTooLow })
  @IsPositive({ message: MetricsExceptionKeys.ValueShouldBeNumber })
  value!: number;
}
