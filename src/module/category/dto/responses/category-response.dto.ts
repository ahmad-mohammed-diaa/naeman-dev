import { ApiProperty } from '@nestjs/swagger';

export class CategoryTranslationDto {
  @ApiProperty() name: string;
  @ApiProperty() language: string;
}

export class CategoryResponseDto {
  @ApiProperty() id: string;
  @ApiProperty({ type: [CategoryTranslationDto] }) translation: CategoryTranslationDto[];
}
