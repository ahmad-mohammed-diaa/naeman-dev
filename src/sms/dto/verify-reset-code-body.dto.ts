import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class VerifyResetCodeBodyDto {
  @ApiProperty({ type: String, required: true, description: 'Phone number of the user' })
  @IsString()
  phone: string;

  @ApiProperty({ type: String, required: true, description: 'Verification code received via SMS' })
  @IsString()
  code: string;

  @ApiProperty({ type: String, required: true, description: 'New password' })
  @IsString()
  password: string;

  @ApiProperty({ type: String, required: true, description: 'Confirm new password' })
  @IsString()
  confirmPassword: string;
}
