import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class BarberOrdersQueryDto {
  @ApiProperty({ type: String, format: 'date-time', required: false, description: 'Filter orders by date' })
  @IsOptional()
  @IsDateString()
  orderDate?: string;
}
