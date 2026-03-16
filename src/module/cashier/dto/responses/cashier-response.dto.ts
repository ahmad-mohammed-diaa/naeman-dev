import { ApiProperty } from '@nestjs/swagger';

export class CashierResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() firstName: string;
  @ApiProperty() lastName: string;
  @ApiProperty() phone: string;
  @ApiProperty() avatar: string;
  @ApiProperty() createdAt: Date;
  @ApiProperty() role: string;
  @ApiProperty() branchId: string;
}
