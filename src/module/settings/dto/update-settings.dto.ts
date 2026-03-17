import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsNumber, IsPositive, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateSettingsDto {
  @ApiProperty({ required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  pointsPercentage?: number;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  referralPoints?: number;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  pointLimit?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  pointValue?: number;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(1)
  @Max(30)
  @IsOptional()
  @Type(() => Number)
  canceledOrder?: number;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(5)
  @IsOptional()
  @Type(() => Number)
  slotDuration?: number;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(1)
  @Max(30)
  @IsOptional()
  @Type(() => Number)
  maxDaysBooking?: number;
}
