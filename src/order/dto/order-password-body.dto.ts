import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OrderPasswordBodyDto {
  @ApiProperty({ type: String, required: true, description: 'Admin password for authorization' })
  @IsString()
  password: string;
}
