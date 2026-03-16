import { ApiProperty } from '@nestjs/swagger';

export class BranchResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() location: string;
  @ApiProperty() openingHour: number;
  @ApiProperty() closingHour: number;
}

export class BranchListResponseDto {
  @ApiProperty({ type: [BranchResponseDto] }) data: BranchResponseDto[];
}
