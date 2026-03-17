import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class SetSlotDto {
  @ApiProperty()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  start: number; // minutes from midnight e.g. 540 for 9:00

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  end: number; // minutes from midnight e.g. 1020 for 17:00
}
