import {
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CategoryType, Language } from 'generated/prisma/enums';

export class TranslationDto {
  @IsString()
  name: string;

  @IsEnum(Language)
  language: Language;
}

export class CreateCategoryDto {
  @IsEnum(CategoryType)
  @IsOptional()
  type?: CategoryType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TranslationDto)
  translations: TranslationDto[];
}

export class UpdateCategoryDto {
  @IsEnum(CategoryType)
  @IsOptional()
  type?: CategoryType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TranslationDto)
  @IsOptional()
  translations?: TranslationDto[];
}
