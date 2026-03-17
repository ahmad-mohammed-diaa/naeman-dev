import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class DateRangeQueryDto {
  @ApiProperty({ type: String, required: false, description: 'Start date (ISO date string)' })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiProperty({ type: String, required: false, description: 'End date (ISO date string)' })
  @IsOptional()
  @IsDateString()
  toDate?: string;
}
