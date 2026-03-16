import { ApiProperty } from '@nestjs/swagger';

export class OrderResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() clientId: string;
  @ApiProperty() barberId: string;
  @ApiProperty() branchId: string;
  @ApiProperty() date: string;
  @ApiProperty() slot: string;
  @ApiProperty() status: string;
  @ApiProperty() total: number;
  @ApiProperty() points: number;
}

export class ReviewTokenResponseDto {
  @ApiProperty({ example: 'eyJhbGci...' })
  reviewToken: string;
  @ApiProperty() total: number;
  @ApiProperty() earnedPoints: number;
}
