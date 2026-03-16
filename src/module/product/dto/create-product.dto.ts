import {
  IsString,
  IsInt,
  IsOptional,
  IsArray,
  ValidateNested,
  IsEnum,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Language } from 'generated/prisma/enums';

export class ProductTranslationDto {
  @IsString()
  name: string;

  @IsEnum(Language)
  language: Language;
}

export class CreateProductDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  price: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductTranslationDto)
  @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
  translations: ProductTranslationDto[];
}

export class UpdateProductDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  price?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductTranslationDto)
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
  translations?: ProductTranslationDto[];
}
