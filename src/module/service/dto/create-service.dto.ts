import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsArray,
  ValidateNested,
  IsEnum,
  Min,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Language } from 'generated/prisma/enums';

export class ServiceTranslationDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: Language })
  @IsEnum(Language)
  language: Language;
}

export class CreateServiceDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  price: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  duration: number; // minutes

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  serviceImg?: string;

  @ApiProperty({ type: [ServiceTranslationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceTranslationDto)
  translations: ServiceTranslationDto[];
}

export class UpdateServiceDto {
  @ApiProperty({ required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  price?: number;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  duration?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  serviceImg?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  available?: boolean;

  @ApiProperty({ type: [ServiceTranslationDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceTranslationDto)
  @IsOptional()
  translations?: ServiceTranslationDto[];
}
