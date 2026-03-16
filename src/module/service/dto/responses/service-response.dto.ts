import { ApiProperty } from '@nestjs/swagger';

export class ServiceResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() price: number;
  @ApiProperty() duration: number;
  @ApiProperty() available: boolean;
}
