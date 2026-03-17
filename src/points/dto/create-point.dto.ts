import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { translationDto } from '../../../src/class-type/translation';
import { Transform } from 'class-transformer';

export class CreatePointDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => +value)
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => +value)
  points: number;

  @ApiProperty({ type: [translationDto] })
  @IsArray()
  translation: translationDto[];
}
