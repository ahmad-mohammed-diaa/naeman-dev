import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGci...' })
  access_token: string;

  @ApiProperty({ example: 'eyJhbGci...' })
  refresh_token: string;
}

export class OtpResponseDto {
  @ApiProperty({ example: 'OTP sent successfully' })
  message: string;
}

export class MessageResponseDto {
  @ApiProperty({ example: 'Operation completed successfully' })
  message: string;
}
