import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SetFcmTokenDto {
  @ApiProperty({ example: 'device-fcm-token-string' })
  @IsString()
  @IsNotEmpty()
  fcmToken: string;
}
