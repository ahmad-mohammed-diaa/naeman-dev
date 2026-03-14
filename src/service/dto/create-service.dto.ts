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
  @ValidateIf(
    (obj) =>
      typeof obj.duration === 'string' || typeof obj.duration === 'number',
  )
  @IsNotEmpty()
  @Transform(({ value }) => +value)
  price: number;

  @ValidateIf(
    (obj) =>
      typeof obj.duration === 'string' || typeof obj.duration === 'number',
  )
  @IsNotEmpty()
  @Transform(({ value }) => +value)
  duration: number;

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

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return value;
  })
  @IsBoolean()
  available: boolean;

  @IsArray()
  Translation: translationDto[];
}
