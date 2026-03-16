import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() price: number;
  @ApiProperty({ nullable: true }) image: string | null;
}
