import { ApiProperty } from '@nestjs/swagger';

export class NotificationResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() title: string;
  @ApiProperty() body: string;
  @ApiProperty() createdAt: Date;
}
