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
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  discount: number;

  @IsEnum(PromoType)
  type: PromoType;

  @IsDateString()
  expiredAt: string;
}
