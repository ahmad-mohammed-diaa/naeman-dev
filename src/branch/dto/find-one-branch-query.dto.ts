import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { CategoryType } from 'generated/prisma/client';

export class FindOneBranchQueryDto {
  @ApiProperty({ type: String, required: false, description: 'Date filter (ISO date string)' })
  @IsOptional()
  @IsDateString()
  Date?: string;

  @ApiProperty({ enum: CategoryType, required: false, description: 'Category type filter' })
  @IsOptional()
  @IsEnum(CategoryType)
  type?: CategoryType;
}
