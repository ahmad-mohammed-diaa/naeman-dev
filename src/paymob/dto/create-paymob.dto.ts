import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePaymobDto {
  @IsString()
  @IsNotEmpty()
  item: string;
}
