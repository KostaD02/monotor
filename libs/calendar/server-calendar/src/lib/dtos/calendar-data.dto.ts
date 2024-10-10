import { IsOptional, IsString } from 'class-validator';
import { CalendarExceptionKeys } from '@monotor/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class CalendarDataDto {
  @ApiProperty({
    required: false,
    default: 'something1',
  })
  @IsOptional()
  @IsString({
    message: CalendarExceptionKeys.CalendarDataShouldBeString,
  })
  mon!: string;

  @ApiProperty({
    required: false,
    default: 'something2',
  })
  @IsOptional()
  @IsString({
    message: CalendarExceptionKeys.CalendarDataShouldBeString,
  })
  tue!: string;

  @ApiProperty({
    required: false,
    default: 'something3',
  })
  @IsOptional()
  @IsString({
    message: CalendarExceptionKeys.CalendarDataShouldBeString,
  })
  wed!: string;

  @ApiProperty({
    required: false,
    default: 'something4',
  })
  @IsOptional()
  @IsString({
    message: CalendarExceptionKeys.CalendarDataShouldBeString,
  })
  thu!: string;

  @ApiProperty({
    required: false,
    default: 'something5',
  })
  @IsOptional()
  @IsString({
    message: CalendarExceptionKeys.CalendarDataShouldBeString,
  })
  fri!: string;

  @ApiProperty({
    required: false,
    default: 'something6',
  })
  @IsOptional()
  @IsString({
    message: CalendarExceptionKeys.CalendarDataShouldBeString,
  })
  sat!: string;

  @ApiProperty({
    required: false,
    default: 'something7',
  })
  @IsOptional()
  @IsString({
    message: CalendarExceptionKeys.CalendarDataShouldBeString,
  })
  sun!: string;
}
