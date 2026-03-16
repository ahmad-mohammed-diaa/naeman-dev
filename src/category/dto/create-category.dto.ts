import { CategoryType } from 'generated/prisma/client';
import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { translationDto } from 'src/class-type/translation';

export class CreateCategoryDto {
  @IsBoolean()
  @IsOptional()
  available: boolean;

  @IsEnum(CategoryType)
  @IsOptional()
  @Transform(({ value }: { value: string }) => value?.toUpperCase())
  type: CategoryType;

  @IsArray()
  translation: translationDto[];
}
