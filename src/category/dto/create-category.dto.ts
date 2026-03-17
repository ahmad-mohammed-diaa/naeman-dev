import { ApiProperty } from '@nestjs/swagger';
import { CategoryType } from 'generated/prisma/client';
import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { translationDto } from 'src/class-type/translation';

export class CreateCategoryDto {
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  available: boolean;

  @ApiProperty({ enum: CategoryType, required: false })
  @IsEnum(CategoryType)
  @IsOptional()
  @Transform(({ value }: { value: string }) => value?.toUpperCase())
  type: CategoryType;

  @ApiProperty({ type: [translationDto] })
  @IsArray()
  translation: translationDto[];
}
