import { ApiProperty } from '@nestjs/swagger';
import { PackagesStatus } from 'generated/prisma/client';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { translationDto } from 'src/class-type/translation';

export class CreatePackageDto {
  @ApiProperty({ type: [String] })
  @IsNotEmpty()
  @IsArray()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      // Handle comma-separated strings like "id1,id2"
      if (value.includes(',')) {
        return value.split(',');
      }
      return [value]; // single string becomes array
    }

    if (Array.isArray(value)) {
      return value;
    }

    return [];
  })
  serviceIds: string[];

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => +value)
  @IsNumber()
  price: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => +value)
  @IsNumber()
  count: number;

  @ApiProperty({ enum: PackagesStatus, required: false })
  @IsEnum(PackagesStatus)
  @IsOptional()
  @Transform(({ value }) => PackagesStatus[value])
  type: PackagesStatus;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  expiresAt: Date;

  @ApiProperty({ type: [translationDto] })
  @IsArray()
  translation: translationDto[];
}
