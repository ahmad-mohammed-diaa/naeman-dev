import { IsString, IsNotEmpty, IsArray, IsOptional, IsInt, Min, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class ReviewOrderDto {
  @IsString()
  @IsNotEmpty()
  barberId: string;

  @IsString()
  @IsNotEmpty()
  branchId: string;

  @IsDateString()
  date: string;

  @IsString()
  @IsNotEmpty()
  slot: string; // "HH:MM"

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  serviceIds?: string[];

  @IsString()
  @IsOptional()
  packageId?: string; // if booking a package session

  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  pointsToRedeem?: number;

  @IsString()
  @IsOptional()
  promoCode?: string;
}
