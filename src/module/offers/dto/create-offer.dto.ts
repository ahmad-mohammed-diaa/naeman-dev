import {
  IsEnum,
  IsDateString,
  IsInt,
  IsOptional,
  IsArray,
  IsString,
  Min,
  ValidateNested,
  ValidateIf,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { OfferType, Language } from 'generated/prisma/enums';

export class OfferTranslationDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(Language)
  language: Language;
}

export class CreateOfferDto {
  @IsEnum(OfferType)
  offerType: OfferType;

  @IsDateString()
  expiresAt: string;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  price: number;

  // ── PACKAGES only ──────────────────────────────────────────────────────────
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @ValidateIf((o) => o.offerType === OfferType.PACKAGES)
  serviceIds?: string[];

  // ── POINTS only ────────────────────────────────────────────────────────────

  @IsInt()
  @Min(1)
  @Type(() => Number)
  @ValidateIf((o) => o.offerType === OfferType.POINTS)
  pointsAmount?: number;

  // ── Both ───────────────────────────────────────────────────────────────────
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OfferTranslationDto)
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  translations: OfferTranslationDto[];
}
