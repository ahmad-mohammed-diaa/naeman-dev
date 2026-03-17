import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsNotEmpty,
  Length,
  IsArray,
} from 'class-validator';
import { translationDto } from '../../../src/class-type/translation';

export class CreateBranchDto {
  @ApiProperty()
  @IsString()
  location: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(10, 16)
  phone: string;

  // @IsString()
  // @IsOptional()
  // @Transform(({ value }) => value ?? null)
  // branchImg: string;

  @ApiProperty()
  @IsString()
  latitude: string;

  @ApiProperty()
  @IsString()
  longitude: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => value ?? null)
  @IsInt()
  @Min(0)
  @Max(10)
  rate?: number;

  @ApiProperty({ type: [translationDto] })
  @IsArray()
  translation: translationDto[];
}
