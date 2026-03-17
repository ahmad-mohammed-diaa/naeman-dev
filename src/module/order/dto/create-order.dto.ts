import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  reviewToken: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  barberId?: string; // barber can be changed after review
}
