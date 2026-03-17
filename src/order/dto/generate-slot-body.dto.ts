import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GenerateSlotBodyDto {
  @ApiProperty({ type: Number, required: true, description: 'Slot start time (hour)' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  start: number;

  @ApiProperty({ type: Number, required: true, description: 'Slot end time (hour)' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  end: number;
}
