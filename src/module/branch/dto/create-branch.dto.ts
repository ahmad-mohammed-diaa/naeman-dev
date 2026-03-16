import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBranchDto {
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  longitude: string;

  @IsString()
  @IsNotEmpty()
  latitude: string;

  @IsString()
  @IsNotEmpty()
  branchImg: string;

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
