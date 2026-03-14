import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class RateBarberDto {
  @IsNotEmpty()
  @IsString()
  barberId: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}
