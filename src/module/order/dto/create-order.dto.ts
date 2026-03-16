import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  reviewToken: string;

  @IsString()
  @IsOptional()
  barberId?: string; // barber can be changed after review
}
