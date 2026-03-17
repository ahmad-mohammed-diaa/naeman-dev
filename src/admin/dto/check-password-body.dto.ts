import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CheckPasswordBodyDto {
  @ApiProperty({ type: String, required: true, description: 'Password to verify' })
  @IsString()
  password: string;
}
