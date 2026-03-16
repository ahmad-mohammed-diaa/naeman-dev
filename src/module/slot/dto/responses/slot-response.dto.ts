import { ApiProperty } from '@nestjs/swagger';

export class SlotResponseDto {
  @ApiProperty({ type: [String], example: ['09:00', '09:30', '10:00'] })
  slots: string[];
}
