import { AuthExpectionKeys } from '@monotor/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ForceAdminDto {
  @ApiProperty({
    required: true,
    default:
      'hmm you should know that, check https://github.com/KostaD02/monotor',
  })
  @IsString({ message: AuthExpectionKeys.SecretCodeShouldBeString })
  secretCode!: string;
}
