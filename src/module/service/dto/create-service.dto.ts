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
  @IsString()
  name: string;

  @IsEnum(Language)
  language: Language;
}

export class CreateServiceDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  price: number;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  duration: number; // minutes

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsOptional()
  serviceImg?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceTranslationDto)
  translations: ServiceTranslationDto[];
}

export class UpdateServiceDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  price?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  duration?: number;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  serviceImg?: string;

  @IsBoolean()
  @IsOptional()
  available?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceTranslationDto)
  @IsOptional()
  translations?: ServiceTranslationDto[];
}
