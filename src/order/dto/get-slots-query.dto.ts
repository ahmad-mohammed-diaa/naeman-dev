import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumberString, IsOptional, IsString } from 'class-validator';

export class GetSlotsQueryDto {
  @ApiProperty({ type: String, required: true, description: 'Date to retrieve available slots (ISO date string)' })
  @IsDateString()
  date: string;

  @ApiProperty({ type: String, required: false, description: 'Barber ID to filter slots' })
  @IsOptional()
  @IsString()
  barberId?: string;

  @ApiProperty({ type: Number, required: false, description: 'Total duration of services in minutes' })
  @IsOptional()
  @IsNumberString()
  totalDuration?: number;
}
