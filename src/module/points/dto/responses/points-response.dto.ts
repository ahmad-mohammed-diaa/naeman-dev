import { ApiProperty } from '@nestjs/swagger';

export class PointsResponseDto {
  @ApiProperty() points: number;
}

export class TransactionResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() clientId: string;
  @ApiProperty() amount: number;
  @ApiProperty() type: string;
  @ApiProperty() createdAt: Date;
}
