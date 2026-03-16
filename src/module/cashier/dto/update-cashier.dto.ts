import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';
import { Days } from 'generated/prisma/enums';

export class UpdateCashierDto {
  @IsString()
  @IsOptional()
  branchId?: string;

  @IsArray()
  @IsEnum(Days, { each: true })
  @IsOptional()
  vacations?: Days[];
}
