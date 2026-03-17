import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class UpdateOrderServicesDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  serviceToDelete: string[];
}
