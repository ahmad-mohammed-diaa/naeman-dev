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
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  branchId: string;

  @IsEnum(CategoryType)
  @IsOptional()
  type?: CategoryType;
}

export class UpdateBarberDto {
  @IsString()
  @IsOptional()
  branchId?: string;

  @IsEnum(CategoryType)
  @IsOptional()
  type?: CategoryType;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @IsArray()
  @IsEnum(Days, { each: true })
  @IsOptional()
  vacations?: Days[];
}
