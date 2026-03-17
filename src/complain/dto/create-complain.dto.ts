import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateComplainDto {
  // @IsNotEmpty()
  // userId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;
}
