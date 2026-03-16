import { IsInt, IsOptional, IsNumber, IsPositive, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateSettingsDto {
  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  pointsPercentage?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  referralPoints?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  pointLimit?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  pointValue?: number;

  @IsInt()
  @Min(1)
  @Max(30)
  @IsOptional()
  @Type(() => Number)
  canceledOrder?: number;

  @IsInt()
  @Min(5)
  @IsOptional()
  @Type(() => Number)
  slotDuration?: number;

  @IsInt()
  @Min(1)
  @Max(30)
  @IsOptional()
  @Type(() => Number)
  maxDaysBooking?: number;
}
