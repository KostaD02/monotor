import { IsString, IsNumber, IsPositive, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MetricsExceptionKeys } from '@monotor/interfaces';

export class MetricsUpdateDataDto {
  @ApiProperty({
    required: false,
    default: '2024-09-27T16:07:47.496Z',
  })
  @IsOptional()
  @IsString({
    message: MetricsExceptionKeys.DateShouldBeString,
  })
  date!: string;

  @ApiProperty({
    required: false,
    default: 1,
  })
  @IsOptional()
  @IsNumber({}, { message: MetricsExceptionKeys.ValueTooLow })
  @IsPositive({ message: MetricsExceptionKeys.ValueShouldBeNumber })
  value!: number;
}
