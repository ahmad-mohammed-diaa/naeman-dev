import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateComplainDto {
  @ApiProperty({ example: 'The barber was late' })
  @IsString()
  @IsNotEmpty()
  message: string;
}
