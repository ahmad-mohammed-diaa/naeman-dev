import { ApiProperty } from '@nestjs/swagger';

export class OfferResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() offerType: string;
  @ApiProperty() expiresAt: Date;
}
