import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class AnalyticsQueryDto {
  @ApiProperty({ required: false, example: '2024-01-01' })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiProperty({ required: false, example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  toDate?: string;
}
