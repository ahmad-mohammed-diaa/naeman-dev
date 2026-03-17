import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';
import { Days } from 'generated/prisma/enums';

export class UpdateCashierDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  branchId?: string;

  @ApiProperty({ enum: Days, isArray: true, required: false })
  @IsArray()
  @IsEnum(Days, { each: true })
  @IsOptional()
  vacations?: Days[];
}
