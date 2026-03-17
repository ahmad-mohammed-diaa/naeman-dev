import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, IsOptional, IsInt, Min, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class ReviewOrderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  barberId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  branchId: string;

  @ApiProperty({ type: String, format: 'date-time' })
  @IsDateString()
  date: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  slot: string; // "HH:MM"

  @ApiProperty({ type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  serviceIds?: string[];

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  packageId?: string; // if booking a package session

  @ApiProperty({ required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  pointsToRedeem?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  promoCode?: string;
}
