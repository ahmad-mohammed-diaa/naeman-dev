import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';
import { translationDto } from 'src/class-type/translation';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  productImg: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
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
