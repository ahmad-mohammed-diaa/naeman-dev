import { ApiProperty } from '@nestjs/swagger';

export class ClientResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() firstName: string;
  @ApiProperty() lastName: string;
  @ApiProperty() phone: string;
  @ApiProperty() avatar: string;
  @ApiProperty() createdAt: Date;
  @ApiProperty() role: string;
  @ApiProperty({ nullable: true }) referralCode: string | null;
  @ApiProperty() points: number;
  @ApiProperty() ban: boolean;
  @ApiProperty() canceledOrders: number;
}

export class ClientListResponseDto {
  @ApiProperty({ type: [ClientResponseDto] }) data: ClientResponseDto[];
  @ApiProperty() total: number;
  @ApiProperty() page: number;
  @ApiProperty() limit: number;
}
