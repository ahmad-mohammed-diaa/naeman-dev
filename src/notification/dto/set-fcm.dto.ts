import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SetFcmDto {
  @ApiProperty({ type: String, required: true, description: 'Firebase Cloud Messaging token' })
  @IsString()
  fcmToken: string;
}
