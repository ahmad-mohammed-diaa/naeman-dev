import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class RateBarberDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  rate: number;
}
