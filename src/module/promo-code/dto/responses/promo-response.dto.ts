import { ApiProperty } from '@nestjs/swagger';

export class PromoCodeResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() code: string;
  @ApiProperty() discount: number;
  @ApiProperty() active: boolean;
  @ApiProperty() expiredAt: Date;
}
