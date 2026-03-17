import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateClientPackageBodyDto {
  @ApiProperty({ type: String, required: true, description: 'Client phone number' })
  @IsString()
  phone: string;
}
