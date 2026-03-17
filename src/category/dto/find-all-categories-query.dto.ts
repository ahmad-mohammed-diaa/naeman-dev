import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CategoryType } from 'generated/prisma/client';

export class FindAllCategoriesQueryDto {
  @ApiProperty({ enum: CategoryType, required: false, description: 'Category type filter' })
  @IsOptional()
  @IsEnum(CategoryType)
  type?: CategoryType;
}
