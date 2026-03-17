import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class SendNotificationDto {
  @ApiProperty({ type: [String], required: true, description: 'Array of FCM tokens to send notification to' })
  @IsArray()
  @IsString({ each: true })
  fcmTokens: string[];

  @ApiProperty({ type: String, required: true, description: 'Notification title' })
  @IsString()
  title: string;

  @ApiProperty({ type: String, required: true, description: 'Notification message body' })
  @IsString()
  message: string;

  @ApiProperty({ type: String, required: false, description: 'Optional image URL for the notification' })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
