import { ScheduleExpceptionKeys } from '@fitmonitor/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsObject, IsOptional } from 'class-validator';

export class ScheduleDataDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsBoolean({
    message: ScheduleExpceptionKeys.DataDuplicateShouldBeABoolean,
  })
  duplicate?: boolean;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsObject({
    message: ScheduleExpceptionKeys.DataShouldBeAnObject,
  })
  mon!: Record<string, string>;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsObject({
    message: ScheduleExpceptionKeys.DataShouldBeAnObject,
  })
  tue!: Record<string, string>;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsObject({
    message: ScheduleExpceptionKeys.DataShouldBeAnObject,
  })
  wed!: Record<string, string>;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsObject({
    message: ScheduleExpceptionKeys.DataShouldBeAnObject,
  })
  thu!: Record<string, string>;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsObject({
    message: ScheduleExpceptionKeys.DataShouldBeAnObject,
  })
  fri!: Record<string, string>;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsObject({
    message: ScheduleExpceptionKeys.DataShouldBeAnObject,
  })
  sat!: Record<string, string>;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsObject({
    message: ScheduleExpceptionKeys.DataShouldBeAnObject,
  })
  sun!: Record<string, string>;
}
