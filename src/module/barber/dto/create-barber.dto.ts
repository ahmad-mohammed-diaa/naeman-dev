import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { CategoryType, Days } from 'generated/prisma/enums';

export class CreateBarberDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  branchId: string;

  @ApiProperty({ enum: CategoryType, required: false })
  @IsEnum(CategoryType)
  @IsOptional()
  type?: CategoryType;
}

export class UpdateBarberDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  branchId?: string;

  @ApiProperty({ enum: CategoryType, required: false })
  @IsEnum(CategoryType)
  @IsOptional()
  type?: CategoryType;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @ApiProperty({ enum: Days, isArray: true, required: false })
  @IsArray()
  @IsEnum(Days, { each: true })
  @IsOptional()
  vacations?: Days[];
}
