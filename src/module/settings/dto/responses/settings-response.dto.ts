import { ApiProperty } from '@nestjs/swagger';

export class SettingsResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() slotDuration: number;
  @ApiProperty() pointsPercentage: number;
  @ApiProperty() pointLimit: number;
  @ApiProperty() pointValue: number;
}
