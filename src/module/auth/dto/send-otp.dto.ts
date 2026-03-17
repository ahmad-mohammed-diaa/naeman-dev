import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class SendOtpDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone: string;
}
