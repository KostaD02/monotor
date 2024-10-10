import { IsEmail, IsString } from 'class-validator';
import { AuthExpectionKeys } from '@monotor/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({
    required: true,
    default: 'konstantine@datunishvili.ge',
  })
  @IsEmail({}, { message: AuthExpectionKeys.InvalidEmail })
  email!: string;

  @ApiProperty({
    required: true,
    default: 'somestrongpassword123',
  })
  @IsString()
  password!: string;
}
