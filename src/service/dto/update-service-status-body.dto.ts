import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateServiceStatusBodyDto {
  @ApiProperty({ type: Boolean, required: true, description: 'Whether the service is available' })
  @IsBoolean()
  available: boolean;
}
