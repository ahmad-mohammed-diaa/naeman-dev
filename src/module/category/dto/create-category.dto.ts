import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: Language })
  @IsEnum(Language)
  language: Language;
}

export class CreateCategoryDto {
  @ApiProperty({ enum: CategoryType, required: false })
  @IsEnum(CategoryType)
  @IsOptional()
  type?: CategoryType;

  @ApiProperty({ type: [TranslationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TranslationDto)
  translations: TranslationDto[];
}

export class UpdateCategoryDto {
  @ApiProperty({ enum: CategoryType, required: false })
  @IsEnum(CategoryType)
  @IsOptional()
  type?: CategoryType;

  @ApiProperty({ type: [TranslationDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TranslationDto)
  @IsOptional()
  translations?: TranslationDto[];
}
