import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class CreateUserRequestDto {
  @ApiProperty({ description: 'User email', example: 'user@company.com' })
  @IsEmail()
  email: string;
}
