import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@motosuisse.ch' })
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}
