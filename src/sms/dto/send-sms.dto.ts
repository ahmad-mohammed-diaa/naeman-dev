import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { RegisterDto } from 'src/auth/dto/auth-register-dto';

export class SendSmsDto extends RegisterDto {
  @ApiProperty({
    enum: ['register', 'reset'],
    required: false,
    description: 'Type of SMS to send: register for new accounts, reset for password reset',
  })
  @IsOptional()
  @IsEnum(['register', 'reset'])
  smsType?: 'register' | 'reset';
}
