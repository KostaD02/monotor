import { IsEmail, IsString } from 'class-validator';
import { AuthExpectionKeys } from '@fitmonitor/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({
    required: true,
  })
  @IsEmail({}, { message: AuthExpectionKeys.InvalidEmail })
  email!: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  password!: string;
}
