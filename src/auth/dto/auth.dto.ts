import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ReferralCodeCheckDto {
  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  @IsString()
  referralCode: string;
}

export class ChangePasswordDto {
  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: '+966500000000' })
  @IsNotEmpty()
  @IsString()
  phone: string;
}
