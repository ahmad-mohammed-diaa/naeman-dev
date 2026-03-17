import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class PaidOrdersQueryDto {
  @ApiProperty({ type: String, required: false, description: 'Date to filter paid orders (ISO date string)' })
  @IsOptional()
  @IsDateString()
  date?: string;
}
