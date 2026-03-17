import { ApiProperty } from '@nestjs/swagger';
import { PromoType } from 'generated/prisma/client';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePromoCodeDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => value ?? null)
  @IsString()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  discount: number;

  @ApiProperty({ enum: PromoType })
  @IsNotEmpty()
  @IsEnum(PromoType)
  type: PromoType;

  @ApiProperty()
  @IsNotEmpty()
  expiredAt: Date;
}
