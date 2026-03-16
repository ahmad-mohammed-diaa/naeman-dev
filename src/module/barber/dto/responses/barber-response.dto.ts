import { ApiProperty } from '@nestjs/swagger';

export class BarberResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() firstName: string;
  @ApiProperty() lastName: string;
  @ApiProperty() phone: string;
  @ApiProperty() avatar: string;
  @ApiProperty() createdAt: Date;
  @ApiProperty() role: string;
  @ApiProperty() branchId: string;
  @ApiProperty() rate: number;
  @ApiProperty() isAvailable: boolean;
  @ApiProperty() type: string;
}
