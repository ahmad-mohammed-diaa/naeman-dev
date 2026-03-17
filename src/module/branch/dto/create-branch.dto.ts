import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBranchDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  longitude: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  latitude: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  branchImg: string;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(0)
  @Max(23)
  @IsOptional()
  @Type(() => Number)
  openingHour?: number;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(0)
  @Max(23)
  @IsOptional()
  @Type(() => Number)
  closingHour?: number;
}
