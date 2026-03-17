import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: Language })
  @IsEnum(Language)
  language: Language;
}

export class CreateProductDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  price: number;

  @ApiProperty({ type: [ProductTranslationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductTranslationDto)
  @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
  translations: ProductTranslationDto[];
}

export class UpdateProductDto {
  @ApiProperty({ required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  price?: number;

  @ApiProperty({ type: [ProductTranslationDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductTranslationDto)
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
  translations?: ProductTranslationDto[];
}
