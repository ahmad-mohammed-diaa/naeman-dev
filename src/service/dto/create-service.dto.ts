import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { translationDto } from '../../../src/class-type/translation';

export class CreateServiceDto {
  @ApiProperty()
  @ValidateIf(
    (obj) =>
      typeof obj.duration === 'string' || typeof obj.duration === 'number',
  )
  @IsNotEmpty()
  @Transform(({ value }) => +value)
  price: number;

  @ApiProperty()
  @ValidateIf(
    (obj) =>
      typeof obj.duration === 'string' || typeof obj.duration === 'number',
  )
  @IsNotEmpty()
  @Transform(({ value }) => +value)
  duration: number;

  @ApiProperty()
  @ValidateIf(
    (obj) =>
      typeof obj.duration === 'string' || typeof obj.duration === 'number',
  )
  @ValidateIf(
    (obj) =>
      typeof obj.duration === 'string' || typeof obj.duration === 'number',
  )
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return value;
  })
  @IsBoolean()
  available: boolean;

  @ApiProperty({ type: [translationDto] })
  @IsArray()
  translation: translationDto[];
}
