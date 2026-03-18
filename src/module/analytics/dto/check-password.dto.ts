import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CheckPasswordDto {
  @ApiProperty({ example: 'admin-password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
