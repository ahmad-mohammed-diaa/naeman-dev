import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePaymobDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  item: string;
}
