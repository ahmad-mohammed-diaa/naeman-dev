import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateBranchDto {
  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  longitude?: string;

  @IsString()
  @IsOptional()
  latitude?: string;

  @IsString()
  @IsOptional()
  branchImg?: string;

  @IsInt()
  @Min(0)
  @Max(23)
  @IsOptional()
  @Type(() => Number)
  openingHour?: number;

  @IsInt()
  @Min(0)
  @Max(23)
  @IsOptional()
  @Type(() => Number)
  closingHour?: number;
}
