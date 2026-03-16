import { ApiProperty } from '@nestjs/swagger';

export class StaticResponseDto {
  @ApiProperty() id: string;
  @ApiProperty({ nullable: true }) aboutEn: string | null;
  @ApiProperty({ nullable: true }) aboutAr: string | null;
}
