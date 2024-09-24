import { IsOptional, IsString } from 'class-validator';
import { CalendarExceptionKeys } from '@fitmonitor/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class CalendarDataDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({
    message: CalendarExceptionKeys.CalendarDataShouldBeString,
  })
  mon!: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({
    message: CalendarExceptionKeys.CalendarDataShouldBeString,
  })
  tue!: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({
    message: CalendarExceptionKeys.CalendarDataShouldBeString,
  })
  wed!: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({
    message: CalendarExceptionKeys.CalendarDataShouldBeString,
  })
  thu!: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({
    message: CalendarExceptionKeys.CalendarDataShouldBeString,
  })
  fri!: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({
    message: CalendarExceptionKeys.CalendarDataShouldBeString,
  })
  sat!: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({
    message: CalendarExceptionKeys.CalendarDataShouldBeString,
  })
  sun!: string;
}
