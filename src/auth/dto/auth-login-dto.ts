import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: '+966500000000',
    required: true,
    description: 'Phone number',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ example: '123456', required: true, description: 'Password' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
