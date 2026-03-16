import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() firstName: string;
  @ApiProperty() lastName: string;
  @ApiProperty() phone: string;
  @ApiProperty({ nullable: true }) avatar: string | null;
  @ApiProperty() createdAt: Date;
  @ApiProperty() role: string;
  // role-specific fields (present when role matches)
  @ApiProperty({ nullable: true }) branchId?: string | null;
  @ApiProperty({ nullable: true }) rate?: number | null;
  @ApiProperty({ nullable: true }) isAvailable?: boolean | null;
  @ApiProperty({ nullable: true }) points?: number | null;
  @ApiProperty({ nullable: true }) ban?: boolean | null;
}

export class UserListResponseDto {
  @ApiProperty({ type: [UserResponseDto] }) data: UserResponseDto[];
  @ApiProperty() total: number;
  @ApiProperty() page: number;
  @ApiProperty() limit: number;
}
