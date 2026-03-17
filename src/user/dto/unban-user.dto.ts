import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UnbanUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  number: string;
}
