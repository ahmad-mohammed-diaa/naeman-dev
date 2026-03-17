import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class AnalyticsQueryDto {
  @ApiProperty({ type: String, required: false, description: 'Start date for analytics range (ISO date string)' })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiProperty({ type: String, required: false, description: 'End date for analytics range (ISO date string)' })
  @IsOptional()
  @IsDateString()
  toDate?: string;
}
