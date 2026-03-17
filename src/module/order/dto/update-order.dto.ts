import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsOptional } from 'class-validator';

export class BarberUpdateOrderDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  serviceIds: string[]; // new complete list of service IDs
}

export class CancelOrderDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  reason?: string;
}
