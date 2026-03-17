import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsEnum,
  IsDateString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PromoType } from 'generated/prisma/enums';

export class CreatePromoCodeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  discount: number;

  @ApiProperty({ enum: PromoType })
  @IsEnum(PromoType)
  type: PromoType;

  @ApiProperty({ type: String, format: 'date-time' })
  @IsDateString()
  expiredAt: string;
}
