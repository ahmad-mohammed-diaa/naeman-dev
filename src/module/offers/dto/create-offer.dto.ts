import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ enum: Language })
  @IsEnum(Language)
  language: Language;
}

export class CreateOfferDto {
  @ApiProperty({ enum: OfferType })
  @IsEnum(OfferType)
  offerType: OfferType;

  @ApiProperty({ type: String, format: 'date-time' })
  @IsDateString()
  expiresAt: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  price: number;

  // ── PACKAGES only ──────────────────────────────────────────────────────────
  @ApiProperty({ type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @ValidateIf((o) => o.offerType === OfferType.PACKAGES)
  serviceIds?: string[];

  // ── POINTS only ────────────────────────────────────────────────────────────
  @ApiProperty({ required: false })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @ValidateIf((o) => o.offerType === OfferType.POINTS)
  pointsAmount?: number;

  // ── Both ───────────────────────────────────────────────────────────────────
  @ApiProperty({ type: [OfferTranslationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OfferTranslationDto)
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  translations: OfferTranslationDto[];
}
